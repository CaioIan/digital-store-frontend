/**
 * Formata um valor numérico para o padrão de moeda brasileiro (R$).
 * Exemplo: 129.9 -> "R$ 129,90"
 */
export const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
