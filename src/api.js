import { createHash } from 'crypto';

/**
 * Récupère les données de l'endpoint en utilisant les identifiants
 * particuliers developer.marvels.com
 * @param url l'end-point
 * @return {Promise<json>}
 */
export const getData = async (url) => {
    const publicKey = "561ece8f131e029a49cfc0bf7db1672e";
    const privateKey = "ed0882e95add46617750f2da836dd287d855eb22";
    const ts = Date.now();
    const hash = await getHash(publicKey, privateKey, ts);

    const apiUrl = `${url}?apikey=${publicKey}&ts=${ts}&hash=${hash}&offset=100`;

    try {
        const response = await fetch(apiUrl);
        const datas = await response.json();

        const resultsWithThumbnail = datas.data.results.filter(character =>
            character.thumbnail && character.thumbnail.path !== "image_not_available"
        );

        const characters = resultsWithThumbnail.map(character => ({
            name: character.name,
            description: character.description,
            thumbnail: character.thumbnail,
            imageUrl: `${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}`
        }));

        return characters;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

/**
 * Calcul la valeur md5 dans l'ordre : timestamp+privateKey+publicKey
 * cf documentation developer.marvels.com
 * @param publicKey
 * @param privateKey
 * @param timestamp
 * @return {Promise<ArrayBuffer>} en hexadecimal
 */
export const getHash = async (publicKey, privateKey, timestamp) => {
    // exo 3
    const hash = createHash('md5');
    hash.update(timestamp + privateKey + publicKey);
    return hash.digest('hex');
}