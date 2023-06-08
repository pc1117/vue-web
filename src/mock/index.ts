import qs from 'qs'

declare interface ConfigProps {
    type: string;
    url: string;
    body: string;
}

const Mock = require('mockjs');

const reData = Mock.mock({
    "rows|100": [{
        "key|+1": 1,
        "age|18-80": 18,
        "name": "@cname",
        "address": "@county(true)"
    }]
});

Mock.mock(new RegExp("/api/products"), "get", ({ body, url, type }: ConfigProps) => {
    const params = qs.parse(url.split("?")[1]);
    const data = { ...reData }
    if (!!params) {
        for (let v in params) {
            data.rows = data.rows.filter((item: any) => {
                if (!(item[v] && params[v])) return true
                else if (!!item[v] && !!params[v] && ((typeof item[v] === "string" && item[v].includes(params[v])) ||
                    (typeof item[v] === "number" && item[v] === Number(params[v])) || item[v] === params[v])) {
                    return true
                } else {
                    return false
                }
            })
        }
    }
    return {
        success: true,
        message: "请求数据成功!",
        data
    }
});

export default {
    'GET /api/index': {
        id: 1,
        name: 'Tom',
        age: 12
    },
    'GET /api/person': {
        id: 2,
        name: 'LiLi',
        age: 22
    },
    'GET /api/products': Mock.mock({
        'list|100': [{ name: '@city', 'value|1-100': 50, 'type|0-2': 1 }],
    })
}


