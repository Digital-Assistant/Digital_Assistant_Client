/**
 * @function getRecordingName
 * @description Returns the first name from the array of names in the recording sequence.
 * If the recording sequence is null or undefined, it returns an empty string.
 * If the name is not a JSON string, it returns 'NA'.
 * @param {any} recordingSequence - The recording sequence
 * @returns {string} - The first name in the recording sequence
 */
export const getRecordingName = (recordingSequence: any) => {
    let name = "";
    if (recordingSequence) {
        try {
            let names = JSON.parse(recordingSequence.name);
            name = names[0] ? names[0] : 'NA';
        } catch (e) {

        }
    }
    return name;
}