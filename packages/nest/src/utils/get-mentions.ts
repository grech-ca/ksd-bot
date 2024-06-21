export const getMentions = (text?: string) => text?.match(/(?<=\[id)(\d*)(?=(\|.+\]))/)?.map(v => +v) ?? [];
