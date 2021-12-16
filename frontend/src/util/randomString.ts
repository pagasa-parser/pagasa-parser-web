export default function(
    length = 16,
    pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
) {
    let result = "";
    let charactersLength = pool.length;
    for ( let i = 0; i < length; i++ ) {
        result += pool.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
