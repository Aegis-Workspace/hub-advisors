const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { startOfMonth, startOfQuarter, startOfYear } = require("date-fns");

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isDocument = file.fieldname.startsWith("documents");
    const uploadPath = isDocument
      ? path.join(__dirname, "public/documents")
      : path.join(__dirname, "public/uploads");

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }
  return res
    .status(403)
    .json({ error: "Acesso negado: apenas administradores" });
};

// Middleware de autenticação
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "seu-segredo-aqui"
    );
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

app.use("/api/usuarios", authMiddleware);
app.use("/api/investiments", authMiddleware);
app.use("/api/reservations", authMiddleware);
app.use("/api/dashboard/captacao", authMiddleware);

app.get("/api/admin/stats", authMiddleware, isAdmin, async (req, res) => {
  try {
    const [
      totalInvestments,
      activeAdvisors,
      pendingReservations,
      pendingSignatures,
    ] = await Promise.all([
      prisma.investment.aggregate({
        _sum: { totalAmount: true },
        where: { status: "RESERVED" },
      }),
      prisma.user.count({
        where: { role: "advisor", status: "ATIVO" },
      }),
      prisma.reservation.count({
        where: { status: "PENDING" },
      }),
      prisma.reservation.count({
        where: { status: "PENDING_SIGNATURE" },
      }),
    ]);

    return res.status(200).json({
      totalInvestments: totalInvestments._sum.amount || 0,
      activeAdvisors,
      pendingReservations,
      pendingSignatures,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/api/admin/activity", async (req, res) => {
  try {
    const activities = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true, // Advisor
        investor: true, // Investor
        investment: true, // Investment
      },
      take: 10,
    });

    const formatted = activities.map((r) => ({
      type: r.status === "PENDING_SIGNATURE" ? "SIGNATURE" : "RESERVATION",
      advisor: r.user.name,
      investor: r.investor.name,
      investment: r.investment?.name || r.investorName || "Desconhecido",
      amount: r.amount,
      date: r.createdAt,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Erro ao buscar atividades recentes:", error);
    res.status(500).json({ error: "Erro ao buscar atividades recentes" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(user, process.env.JWT_SECRET || "seu-segredo-aqui", {
      expiresIn: "7d",
    });

    res.json({ success: true, user, token });
  } else {
    res.status(401).json({ success: false, message: "Credenciais inválidas" });
  }
});
app.get("/api/investors", authMiddleware, async (req, res) => {
  const { id } = req.user;

  try {
    const investors = await prisma.user.findMany({
      where: {
        role: "cliente",
        parentId: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        rg: true,
        address: true,
        bankAccount: true,
        createdAt: true,
      },
    });

    res.json(investors);
  } catch (error) {
    console.error("[GET /investors/:advisorId]", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar investidores do assessor" });
  }
});
// Cadastro de usuário
app.post("/api/register", async (req, res) => {
  const { name, email, password, role, ...rest } = req.body;
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ success: false, message: "Campos obrigatórios faltando" });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        role,
        address: rest.address ?? null,
        bankAccount: rest.bankAccount ?? null,
        ...rest,
      },
    });
    return res.json(user).status(201);
  } catch (e) {
    console.log(e);

    res
      .status(400)
      .json({ success: false, message: "Erro ao registrar usuário" });
  }
});

// Listar ativos
app.get("/api/investments", async (req, res) => {
  const investments = await prisma.investment.findMany();
  res.json(investments);
});

app.get("/api/investments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const investment = await prisma.investment.findUnique({
      where: { id: Number(id) },
      include: {
        documents: true,
        news: true,
        commission: true,
        reservations: true,
      },
    });
    if (!investment)
      return res.status(404).json({ error: "Investment not found" });
    res.json(investment);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/investments", upload.any(), async (req, res) => {
  try {
    const body = req.body;

    const commission = JSON.parse(body.commission || "{}");
    const registeredWith = body.registeredWith
      ? JSON.parse(body.registeredWith)
      : [];

    const documentFiles = req.files.filter((f) => f.fieldname === "documents");
    const documentNames = req.body.documentNames;

    const names = Array.isArray(documentNames)
      ? documentNames
      : [documentNames];

    const documents = documentFiles.map((file, index) => ({
      name: names[index] || file.originalname,
      url: `/documents/${file.filename}`,
    }));

    const newInvestment = await prisma.investment.create({
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        type: body.type,
        yieldRate: parseFloat(body.yieldRate),
        yieldIndex: body.yieldIndex,
        minAmount: parseFloat(body.minAmount),
        totalAmount: parseFloat(body.totalAmount),
        availableAmount: parseFloat(body.totalAmount),
        reservedAmount: 0,
        term: body.term ? parseInt(body.term) : null,
        guarantee: JSON.parse(body.guarantee),
        paymentFrequency: body.paymentFrequency,
        registeredWith,
        riskLevel: body.riskLevel,
        logo: body.logo,
        image: body.image,
        status: body.status,
        documents: {
          create: documents.map((doc) => ({
            name: doc.name,
            url: doc.url,
          })),
        },
        commission: {
          create: {
            upfrontRate: commission.upfront?.rate,
            upfrontPayment: commission.upfront?.payment,
            recurringRate: commission.recurring?.rate,
            recurringFrequency: commission.recurring?.frequency,
          },
        },
      },
      include: {
        documents: true,
        commission: true,
      },
    });

    res.json({ success: true, investment: newInvestment });
  } catch (e) {
    console.error("Erro ao cadastrar ativo:", e);
    res
      .status(500)
      .json({ success: false, message: "Erro ao cadastrar ativo" });
  }
});

app.delete("/api/investments", async (req, res) => {
  const { investmentId } = req.body;
  try {
    const investment = await prisma.investment.delete({
      where: { id: investmentId },
    });

    res.status(200).json({
      success: true,
      message: "Ativo deletado com sucesso",
      data: investment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
});

app.put("/api/investments", async (req, res) => {
  const { investmentId, type, yieldRate, yieldIndex, totalAmount, status } =
    req.body;

  const bodyParams = {
    type,
    yieldRate,
    yieldIndex,
    totalAmount,
    status,
  };
  const filteredData = Object.fromEntries(
    Object.entries(bodyParams).filter(
      ([_, value]) => value !== undefined && value !== null
    )
  );
  try {
    const updatedInvestment = await prisma.investment.update({
      where: { id: investmentId },
      data: filteredData,
    });

    res.status(200).json({
      success: true,
      message: "Investimento atualizado com sucesso",
      data: updatedInvestment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Erro ao atualizar o investimento",
    });
  }
});

app.post("/api/reservations", async (req, res) => {
  const { investmentId, userId, amount, investorName } = req.body;

  try {
    const investment = await prisma.investment.findUnique({
      where: { id: investmentId },
    });

    if (!investment) {
      return res
        .status(404)
        .json({ success: false, message: "Ativo não encontrado" });
    }

    if ((investment.availableAmount ?? 0) < amount) {
      return res
        .status(400)
        .json({ success: false, message: "Cotas insuficientes" });
    }

    await prisma.investment.update({
      where: { id: investmentId },
      data: {
        availableAmount: (investment.availableAmount ?? 0) - amount,
      },
    });

    const newReservation = await prisma.reservation.create({
      data: {
        investmentId,
        userId,
        investorName,
        amount,
        status: "PENDING_SIGNATURE",
      },
    });

    res.json({ success: true, reservation: newReservation });
  } catch (error) {
    console.error("Erro ao reservar:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno ao reservar cota" });
  }
});

// Listar reservas de um usuário
app.get("/api/reservations/:userId", async (req, res) => {
  const { userId } = req.params;
  const reservations = await prisma.reservation.findMany({
    where: { userId: Number(userId) },
  });
  res.json(reservations);
});

// Endpoint de dashboard (KPIs)
app.get("/api/dashboard", authMiddleware, async (req, res) => {
  try {
    const advisorId = req.user.id;

    const totalInvested = await prisma.reservation.aggregate({
      where: { userId: advisorId },
      _sum: { amount: true },
    });

    const totalReservations = await prisma.reservation.count({
      where: { userId: advisorId },
    });

    const totalInvestments = await prisma.investment.count({
      where: {
        reservations: {
          some: {
            userId: advisorId,
          },
        },
      },
    });

    const totalInvestors = await prisma.user.count({
      where: {
        parentId: advisorId,
      },
    });

    return res.json({
      totalInvested: totalInvested._sum.amount || 0,
      totalInvestments,
      totalReservations,
      totalInvestors,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/dashboard/captacao", async (req, res) => {
  try {
    const rows = await prisma.reservation.groupBy({
      by: ["createdAt"],
      _sum: { amount: true },
      orderBy: { createdAt: "asc" },
      where: { createdAt: { gte: new Date("2023-01-01") } },
    });

    // Formatar as datas para o formato 'YYYY-MM'
    const formattedRows = rows.map((row) => ({
      mes: row.createdAt.toISOString().slice(0, 7),
      captado: row._sum.amount || 0,
    }));

    return res.json(formattedRows);
  } catch (error) {
    console.error("Error fetching dashboard captacao data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/investimentos/:id/reservar", async (req, res) => {
  const { id } = req.params;
  const { userId, amount, investorId } = req.body;

  if (!userId || !amount || !investorId) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios: userId, investorId, amount" });
  }

  try {
    // Consulta o investimento
    const investimento = await prisma.investment.findUnique({
      where: { id: +id },
      select: { id: true, status: true },
    });

    if (!investimento) {
      return res.status(404).json({ error: "Investimento não encontrado" });
    }

    if (investimento.status !== "OPEN") {
      return res
        .status(400)
        .json({ error: "Investimento não está disponível" });
    }

    // Busca o nome do investidor pelo investorId
    const investor = await prisma.user.findUnique({
      where: { id: investorId },
      select: { name: true },
    });

    if (!investor) {
      return res.status(404).json({ error: "Investidor não encontrado" });
    }

    const investorName = investor.name;
    // Executa transação: atualiza investimento e cria reserva
    const result = await prisma.$transaction([
      prisma.investment.update({
        where: { id: +id },
        data: { status: "RESERVED" },
      }),
      prisma.reservation.create({
        data: {
          investmentId: +id,
          userId,
          investorId,
          investorName,
          amount,
          status: "PENDING_SIGNATURE",
        },
      }),
    ]);

    const reservaCriada = result[1]; // reservation.create é a segunda operação
    res.status(201).json({
      message: "Investimento reservado com sucesso",
      reservation: reservaCriada,
    });
  } catch (error) {
    console.error("Erro ao reservar investimento:", error);
    res.status(500).json({ error: "Erro ao reservar investimento" });
  }
});

app.get("/api/admin/reservas", authMiddleware, isAdmin, async (req, res) => {
  try {
    const reservas = await prisma.reservation.findMany({
      include: { investment: true, user: true },
    });

    return res.json(reservas).status(200);
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/api/advisors", async (req, res) => {
  try {
    // Busca todos os usuários que são assessores ativos
    const advisors = await prisma.user.findMany({
      where: {
        role: "advisor",
        status: "ATIVO",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const advisorsWithStats = await Promise.all(
      advisors.map(async (advisor) => {
        const investments = await prisma.reservation.findMany({
          where: {
            userId: advisor.id,
          },
          select: {
            id: true,
            commissionUpfrontRate: true,
            commissionRecurringRate: true,
          },
        });
        const investmentIds = investments.map((i) => i.id);

        // Soma total captado (reservas confirmadas para investimentos do assessor)
        const totalRaisedResult = await prisma.reservation.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            investmentId: { in: investmentIds },
            status: "CONFIRMED", // considerar só reservas confirmadas
          },
        });

        const totalRaised = totalRaisedResult._sum.amount ?? 0;

        let totalCommission = 0;
        investments.forEach((investment) => {
          if (investment.commission) {
            totalCommission +=
              (investment.commission.upfrontRate / 100) * totalRaised +
              (investment.commission.recurringRate / 100) * totalRaised;
          }
        });

        // Conta investidores ativos com reservas confirmadas nos investimentos do assessor
        const uniqueInvestorIds = await prisma.reservation.findMany({
          where: {
            investmentId: { in: investmentIds },
            status: "CONFIRMED",
            user: {
              status: "ATIVO",
            },
          },
          select: {
            investorId: true,
          },
          distinct: ["investorId"], // Distinct funciona no findMany, não no count
        });

        return {
          ...advisor,
          totalRaised,
          totalCommission,
          activeInvestors: uniqueInvestorIds,
        };
      })
    );

    res.json(advisorsWithStats).status(200);
  } catch (error) {
    console.error("Erro ao buscar assessores:", error);
    res.status(500).json({ message: "Erro ao buscar assessores" });
  }
});

app.get("/api/portfolio", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { period } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const { startOfMonth, startOfQuarter, startOfYear } = require("date-fns");
    const now = new Date();

    let periodStart;
    switch (period) {
      case "month":
        periodStart = startOfMonth(now);
        break;
      case "quarter":
        periodStart = startOfQuarter(now);
        break;
      case "year":
        periodStart = startOfYear(now);
        break;
    }

    const commissions = await prisma.commission.findMany({
      where: {
        investment: {
          reservations: {
            some: {
              userId: userId,
            },
          },
        },
        ...(periodStart && {
          dueDate: {
            gte: periodStart,
          },
        }),
      },
      include: {
        investment: {
          include: true,
        },
      },
    });

    const formattedCommissions = commissions.map((c) => ({
      id: String(c.id),
      investment: c.investment.name,
      investor: c.investment.investor.name,
      amount: c.amount ?? 0,
      type: c.upfrontPayment === "IMMEDIATE" ? "UPFRONT" : "RECURRING",
      status: c.status ?? "PENDING",
      dueDate: c.dueDate?.toISOString() ?? "",
      paidDate: c.paidDate?.toISOString() ?? null,
    }));

    return res.status(200).json({
      commissions: formattedCommissions,
      bankAccount: req.user.bankAccount ?? null,
    });
  } catch (err) {
    console.error("[GET /api/portfolio]", err);
    res.status(500).json({ error: "Erro ao buscar dados da carteira" });
  }
});
// Executando o servidor
const PORT = process.env.PORT || 3001;
app.listen(3001, () => {
  console.log(`Server is running on port ${PORT}`);
});
