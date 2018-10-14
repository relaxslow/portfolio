xs.init = function (module) {
    let h = [0, 1, 3, 5, 10, 15];
    let v = [0, 20, 50, 100];
    let cellsData = createCell(h, v);

    function createCell(h, v) {
        let cellDatas = [];
        let num = h.length * v.length;
        for (let i = 0; i < h.length; i++) {
            for (let j = 0; j < v.length; j++) {
                let cell = {
                    hmin: h[i],
                    hmax: h[i + 1],
                    vmin: v[j],
                    vmax: v[j + 1]
                }
                cellDatas.push(cell);

            }
        }
    }
}