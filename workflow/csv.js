const {readFileSync, writeFileSync} = require('fs');

class CSV {

    static load(path, RecordType) {
        let content = readFileSync(path);
        return new String(content)
            .split(/\n\r?/)
            .map(line => new RecordType(line));        
    }

    static store(path, records, lineSeparator = '\n') {
        writeFileSync(path, records.join(lineSeparator));
    }
}

module.exports = CSV;