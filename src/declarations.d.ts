declare const require: {
    context: (directory: string, useSubdirectories?: boolean, regExp?: RegExp, mode?: string) => {
        keys: () => string[];
        (id: string): any;
    };
};
