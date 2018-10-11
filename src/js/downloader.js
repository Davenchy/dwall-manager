const uuid = require('uuid');

// downloader object
const downloader = new Vue({
    data: {
        // the current running tasks
        tasks: []
    },
    methods: {
        // start new download task
        // url: file url
        // done: callback
        // prog: progress callback
        // group: task group name
        // cankill: can kill the task
        // base64: convert buffer to base64 after download
        Task: function (ops, norepeat = true) {
            // setup options
            ops = Object.assign({
                url: '',
                done: ()=>{},
                prog: ()=>{},
                group: '',
                cankill: true,
                base64: true
            }, ops);

            // check url
            if (!ops.url || ops.url == '') throw new Error('set url');

            // check if task with the same url exists
            if (norepeat) {
                for (let i = 0; i < this.tasks.length; i++) {
                    const task = this.tasks[i];
                    if (task.url === ops.url && (task.ok || task.downloading)) {
                        ops.done(task);
                        return task;
                    }
                }
            }

            const self = this;
            const xhr = new XMLHttpRequest();
            const task = {
                id: uuid(), group: ops.group || '', xhr,
                url: ops.url, cankill: ops.cankill,
                kill: () => { xhr.abort() },
                progress: -1,
                downloading: true
            };

            xhr.open('GET', ops.url);
            xhr.responseType = 'arraybuffer';
            xhr.onerror = function () {
                task.kill = undefined;
                task.cankill = undefined;
                task.ok = false;
                task.downloading = false;
                ops.done(task);
            }
            xhr.onloadend = function () {
                task.kill = undefined;
                task.cankill = undefined;

                task.data = xhr.response;
                task.downloading = false;
                task.ok = false;
                if (xhr.response) task.ok = true;

                if (ops.base64) {
                    buffer = new Uint8Array(xhr.response);
                    var data = '';
                    for (let i = 0; i < buffer.length; i++) {
                        const c = buffer[i];
                        data += String.fromCharCode(c);
                    }
                    task.data = btoa(data);
                }

                ops.done(task);
            }
            xhr.onprogress = function (e) {
                var p = -1;
                if (e.lengthComputable) p = Math.round(100 * e.loaded / e.total);
                task.progress = p;
                ops.prog(p);
            }
            xhr.send();

            this.tasks.push(task)
            return task;
        },
        // kill all tasks in group, set force to kill even if it not killable
        killGroup: function (group = '', force = false) {
            this.tasks.forEach(task => {
                if (task.group === group && task.kill != undefined) task.kill();
            });
        },
        // kill all tasks in all groups, set force to kill even if it not killable
        killAll: function (force = false) {
            this.tasks.forEach(task => {if (task.kill != undefined) task.kill()})
        },
        // clean caches and reduce ram usage
        clean: function () {
            this.tasks = this.tasks.map(task => {
                if (task.downloading) return task;
                return undefined;
            });
        }
    }
})




const a = new Vue({
    data: {
        l: []
    },
    methods: {
        create: function () {
            const b = {
                data: ''
            }

            setTimeout(() => {
                b.data = uuid();
                console.log('done');
            }, 2000);

            return b;
        }
    }
});
