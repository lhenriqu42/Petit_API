
export interface IProdInfoDTO {
    prod_id: number;
    initial_stock: number;
    final_stock: number;
    entries_qty: number;
    entries_cost: number;
    exits_qty: number;
    CPV: number;
    revenue: number;
    number_of_sales: number;
    profit: number;
    margin_perc: number;
    individual_participation: number;
    cumulative_participation: number;
    profit_group: 'A' | 'B' | 'C';
}


type TCurvaABCInfo = {
    group: 'A' | 'B' | 'C';
    percentage: number;
    acumulatedPercentage: number;
};
export interface IProdUtilsDTO {
    prod_id: number;
    number_of_sales: number;            // Número de Vendas = contagem das vendas realizadas
    revenue: number;                    // Faturamento = soma(valor_total_das_vendas)
    CPV: number;                        // CPV = Estoque Inicial + Compras – Estoque Final
    profit: number;                     // Lucro Bruto = Faturamento - CPV
    MB: number;                         // Margem Bruta (MB) = Lucro Bruto / Faturamento
    liquidProfit: number;               // Lucro Líquido = Lucro Bruto - Despesas Operacionais
    ML: number;                         // Margem Líquida (ML) = Lucro Líquido / Faturamento
    ticketAverage: number;              // Ticket Médio = Faturamento / Número de Vendas
    GE: number;                         // Giro de Estoque (GE) = CPV / Estoque Médio
    diasDeEstoque: number;              // Cobertura de Estoque (DE) = Estoque Atual / ((CPV / Número de dias do período))
    idadeMediaEstoque: number;          // Idade Média do Estoque = 365 / GE
    CurvaABC: TCurvaABCInfo;
}