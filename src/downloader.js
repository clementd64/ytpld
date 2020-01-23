const fs = require('fs');
const ytdl = require('ytdl-core');
const { exec } = require('./utils');

class Downloader {
    constructor(id, filename) {
        this.id = id;
        this.filename = filename;
    }

    download() {
        return new Promise((resolse, reject) => {
            ytdl(`http://www.youtube.com/watch?v=${this.id}`, {
                filter: 'audioonly',
                quality: 'highest'
            })
            .pipe(fs.createWriteStream(this.filename))
            .on('end', () => this.end())
            .on('error', reject);
        });
    }

    async end() {
        // reencode file because audiowaveform can't read it
        await exec(`ffmpeg -i ${this.filename} -f mp3 ${this.filename}.tmp`);
        await fs.promises.unlink(this.filename);
        await fs.promises.rename(`${this.filename}.tmp`, this.filename);
        return this;
    }
}

module.exports = Downloader;