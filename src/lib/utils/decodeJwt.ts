export default (token: string) => {
    const cleaned = token
        .split('.')[1]
        .replace('-', '+')
        .replace('_', '/');
    const decoded = atob(cleaned)
        .split('')
        .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join('')

    return JSON.parse(decodeURIComponent(decoded));
}