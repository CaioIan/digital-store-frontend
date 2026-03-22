import type { ChangeEvent } from 'react'
import { formatCEP, formatCPF, formatPhone, removeNonNumbers } from '../utils'

/**
 * Hook para aplicar máscara de CPF (000.000.000-00).
 * 
 * Retorna a função `applyMask` para ser usada no evento de mudança (onChange)
 * e `getCleanValue` para obter apenas os números.
 */
export const useCPFMask = () => {
  const applyMask = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, selectionStart } = e.target
    const unmaskedValue = removeNonNumbers(value)

    // Limita a 11 dígitos
    if (unmaskedValue.length > 11) return

    const maskedValue = formatCPF(unmaskedValue)
    e.target.value = maskedValue

    // Ajusta posição do cursor
    const newCursorPosition = calculateCursorPosition(
      value,
      maskedValue,
      selectionStart || 0
    )

    requestAnimationFrame(() => {
      e.target.setSelectionRange(newCursorPosition, newCursorPosition)
    })
  }

  const getCleanValue = (maskedValue: string) => removeNonNumbers(maskedValue)

  return { applyMask, getCleanValue }
}

/**
 * Hook para aplicar máscara de telefone
 */
export const usePhoneMask = () => {
  const applyMask = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, selectionStart } = e.target
    const unmaskedValue = removeNonNumbers(value)

    // Limita a 11 dígitos
    if (unmaskedValue.length > 11) return

    const maskedValue = formatPhone(unmaskedValue)
    e.target.value = maskedValue

    // Ajusta posição do cursor
    const newCursorPosition = calculateCursorPosition(
      value,
      maskedValue,
      selectionStart || 0
    )

    requestAnimationFrame(() => {
      e.target.setSelectionRange(newCursorPosition, newCursorPosition)
    })
  }

  const getCleanValue = (maskedValue: string) => removeNonNumbers(maskedValue)

  return { applyMask, getCleanValue }
}

/**
 * Hook para aplicar máscara de CEP
 */
export const useCEPMask = () => {
  const applyMask = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, selectionStart } = e.target
    const unmaskedValue = removeNonNumbers(value)

    // Limita a 8 dígitos
    if (unmaskedValue.length > 8) return

    const maskedValue = formatCEP(unmaskedValue)
    e.target.value = maskedValue

    // Ajusta posição do cursor
    const newCursorPosition = calculateCursorPosition(
      value,
      maskedValue,
      selectionStart || 0
    )

    requestAnimationFrame(() => {
      e.target.setSelectionRange(newCursorPosition, newCursorPosition)
    })
  }

  const getCleanValue = (maskedValue: string) => removeNonNumbers(maskedValue)

  return { applyMask, getCleanValue }
}

/**
 * Calcula a nova posição do cursor após aplicar a máscara
 */
const calculateCursorPosition = (
  oldValue: string,
  newValue: string,
  oldCursorPosition: number
): number => {
  // Se o novo valor é menor, mantém a posição proporcional
  if (newValue.length < oldValue.length) {
    return Math.min(oldCursorPosition, newValue.length)
  }

  // Se o novo valor é maior, ajusta para os caracteres de máscara adicionados
  let newCursorPosition = oldCursorPosition
  const lengthDifference = newValue.length - oldValue.length

  // Se adicionamos caracteres de máscara, move o cursor para frente
  if (lengthDifference > 0) {
    newCursorPosition += lengthDifference
  }

  return Math.min(newCursorPosition, newValue.length)
}
