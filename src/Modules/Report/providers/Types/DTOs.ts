export interface IUtilsDTO {
    revenue: number;            // Faturamento = soma(valor_total_das_vendas)
    CPV: number;                // CPV = Estoque Inicial + Compras – Estoque Final
    profit: number;             // Lucro Bruto = Faturamento - CPV
    MB: number;                 // Margem Bruta (MB) = Lucro Bruto / Faturamento
    liquidProfit: number;       // Lucro Líquido = Lucro Bruto - Despesas Operacionais
    ML: number;                 // Margem Líquida (ML) = Lucro Líquido / Faturamento
    ticketAverage: number;      // Ticket Médio = Faturamento / Número de Vendas
    GE: number;                 // Giro de Estoque (GE) = CPV / Estoque Médio
    CoberturaDeEstoque: number; // Cobertura de Estoque (DE) = Estoque Atual / ((CPV / Número de dias do período))
    idadeMediaEstoque: number;  // Idade Média do Estoque = 365 / GE
    inventario: number;         // Inventário = soma(quantidade * custo_unitário)
    CurvaABC: {
        A: number; // Percentual de produtos na categoria A
        B: number; // Percentual de produtos na categoria B
        C: number; // Percentual de produtos na categoria C
    };
}
// 2.6. Curva ABC
// Classificação de produtos por importância.
// Critério clássico:
// A → 80% do faturamento
// B → 15%z
// C → 5%
// Passo a passo:
// Ordena produtos por faturamento.
// Calcula % acumulado.
// Classifica em A, B ou C.
// Se quiser, monto a query.








interface IPerformanceDTO {
    grossMargin: number; // MB = (Faturamento - Custo dos produtos vendidos) / Faturamento
    netMargin: number;   // ML = Lucro líquido / Faturamento
    inventoryTurnover: {
        preciseTurnover: number // GE = Custo dos produtos vendidos / Estoque médio
        simpleTurnover: number // GE = Custo dos produtos vendidos / Estoque Atual
    };
    daysOfInventory: number;   // DE = Estoque atual / ((CPV = ) / 365)
}

interface IProjectionDTO {
    projectedRevenue: {         // Projeção de faturamento: Baseado na média móvel (últimos 7, 30 e 90 dias)
        next7Days: number;
        next30Days: number;
        next90Days: number;
    };
    projectedProfit: {          // Projeção de lucro: LP = Faturamento Projetado − Custos Fixos − CPV Projetado
        next7Days: number;
        next30Days: number;
        next90Days: number;
    };
}

interface ITopProductDTO {
    productId: string;
    productName: string;
    totalQuantitySold: number;
    totalRevenue: number;
    totalProfit: number;
    profitMargin: number; // (%) Calculado como (Lucro / Faturamento) * 100
    category: 'A' | 'B' | 'C'; // Para Curva ABC = Todos os produtos são categorizados em A, B ou C com base em sua importância
}
// Como Calcular a Curva ABC:
// 	- Classificar os produtos com base no faturamento total
// 	- Calcular o percentual acumulado do faturamento
// 4) Classifique:
// Até 70–80% → A
// 80–95% → B
// Acima de 95% → C


export interface ILowMarginProductDTO {
    lowMarginProducts: {
        productId: string;
        productName: string;
        profitMargin: number; // (%)
    }[],
    top10NotSaledProducts: {
        productId: string;
        productName: string;
        lastDaySold: Date | null;
        daysWithoutSales: number; // if lastDaySold is null, daysWithoutSales is calculated from product creation date
    }[]
}

interface IStockReportDTO {
    totalStockValue: number; // Valor total do estoque
    abcCurve: {
        items: ITopProductDTO[];
        AQuantity: number;
        BQuantity: number;
        CQuantity: number;
    };
}

export interface IRangePerformanceResponseDTO {
    range: { startDate: Date; endDate: Date; };
    profit: number;
    revenue: number;
    salesCount: number;
    averageTicket: number;
    avarageTicketVariation: number; // (%)
    granularity: 'daily' | 'weekly' | 'monthly' | 'yearly'; // RANGE: Daily: pelo menos 1 dia, Weekly: pelo menos 7 dias, Monthly: pelo menos 1 mês, Yearly: pelo menos 1 ano
    granularityGrowthRate: {
        revenueGrowthRate: number; // (%)
        profitGrowthRate: number; // (%)
        salesCountGrowthRate: number; // (%)
        averageTicketGrowthRate: number; // (%)
    };
    history: {
        granularityValue: string; // e.g., '2023-01-01' for daily, '2023-W01' for weekly, '2023-01' for monthly, '2023' for yearly
        revenue: number;
        profit: number;
        salesCount: number;
        averageTicket: number;
        proportionOfRevenue: number; // (%) (Resultado % do front-end)
    }[];
    performanceIndicators: IPerformanceDTO;
    top50Products: ITopProductDTO[];
    projection: IProjectionDTO;
    stockReport: IStockReportDTO;
}