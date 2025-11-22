/**
 * Extracts the primary name from a recording sequence object.
 * The name is expected to be stored as a JSON string within the `name` property of the sequence.
 * This function parses the JSON string and returns the first element of the resulting array.
 *
 * @param recordingSequence The recording sequence object, which should have a `name` property.
 * @returns The first name from the parsed array. Returns 'NA' if the name cannot be parsed or is empty.
 *          Returns an empty string if the `recordingSequence` is null or undefined.
 */
export const getRecordingName = (recordingSequence: any) => {
    let name = "";
    if (recordingSequence) {
        try {
            // The `name` property is expected to be a JSON string representing an array of names.
            let names = JSON.parse(recordingSequence.name);
            // Return the first name in the array, or 'NA' if the array is empty.
            name = names[0] ? names[0] : 'NA';
        } catch (e) {
            // If parsing fails, it means the name is not a valid JSON string.
            // In this case, you might want to handle it differently, but here we just let it return an empty string.
        }
    }
    return name;
}
