/**
 * SpellBinder Design System - Paleta de Cores Oficial ("O Manda-Chuva")
 * Suporte completo para Light e Dark Mode Editorial.
 */

export const colors = {
    light: {
        background: '#faf9f5',
        surface: '#ffffff',
        'surface-alt': '#f2efe8',
        'text-main': '#24211f',
        'text-muted': '#625d59',
        'text-light': '#746d67',
        'text-faint': '#a29b94',
        'text-teste': '#000000',
        gold: '#e6c66d',
        bronze: '#9b7130',
        dark: '#171513',
        'dark-hover': '#2a2623',
        border: '#ded9ce',
        'border-subtle': 'rgba(0, 0, 0, 0.08)',
    },
    dark: {
        background: '#171A1F',
        surface: '#28313A',
        'surface-alt': '#20252C',
        'surface-elevated': '#303A45',
        'text-main': '#F2EEE6',
        'text-muted': '#B8B5AE',
        'text-light': '#858B91',
        'text-faint': '#575D65',
        gold: '#C9963E',
        'gold-hover': '#E0B45A',
        'gold-soft': 'rgba(201, 150, 62, 0.16)',
        dark: '#171A1F',
        'dark-hover': '#20252C',
        border: 'rgba(242, 238, 230, 0.14)',
        success: '#7DBA91',
        error: '#D87972',
    }
};

// Mantém retrocompatibilidade caso alguma tela chame direto as propriedades do light mode
export const defaultColors = colors.light;