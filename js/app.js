// Copyright (c) 2023 YA-androidapp(https://github.com/yzkn) All rights reserved.


const s2b = (str, sep = '') => {
    str = str.trim(str);
    if (sep == '') {
        let array = [];
        for (let i = 0; i < str.length / 2; i++)
            array[i] = parseInt(str.substr(i * 2, 2), 16);
        return array;
    } else {
        return str.split(sep).map((h) => {
            return parseInt(h, 16);
        });
    }
};

const b2s = (bytes, sep = '', prefix = '', suffix = '') => {
    if (bytes instanceof ArrayBuffer)
        bytes = new Uint8Array(bytes);
    if (bytes instanceof Uint8Array)
        bytes = Array.from(bytes);

    return bytes.map((b) => {
        const s = b.toString(16);
        const v = (b < 0x10 ? ('0' + s) : s);

        // return '<span class="v' + v + '">' + prefix + v + suffix + '</span>';
        return prefix + v + suffix;
    }).join(sep);
};

const format = (data, num_of_interval = 16) => {
    let target = data.replace(/\r?\n|\s/g, '');
    let array = s2b(target);
    let str = '';
    for (let i = 0; i < array.length; i += num_of_interval) {
        str += b2s(array.slice(i, i + num_of_interval), ' ') + '\n';
    }
    return str;
};

const open = (event) => {
    let file = event.target.files[0];
    let r = new FileReader();
    r.onload = (f) => {
        document.getElementById('binary').value = format(b2s(new Uint8Array(f.target.result)));
    };
    r.readAsArrayBuffer(file);
};

const save = _ => {
    let target = document.getElementById('binary').value.replace(/\r?\n|\s/g, '');
    let array = s2b(target);
    let buf = new ArrayBuffer(array.length);
    let d = new DataView(buf);
    for (let i = 0; i < array.length; i++)
        d.setUint8(i, array[i]);

    let blob = new Blob([buf], { type: "octet/stream" });
    let url = window.URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.target = '_blank';
    a.download = "result.bin";
    a.click();
    window.URL.revokeObjectURL(url);
};

window.addEventListener('DOMContentLoaded', _ => {
    document.getElementById('binary').addEventListener('change', (event) => document.getElementById('binary').value = format(document.getElementById('binary').value));
    document.getElementById('open').addEventListener('change', (event) => open(event));
    document.getElementById('open').addEventListener('click', (event) => event.target.value = '');
    document.getElementById('save').addEventListener('click', () => save());
});
