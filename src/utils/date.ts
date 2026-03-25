export function formatDate(date: string) {
    const fecha = new Date(date);

    return new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'long',
    }).format(fecha);
}