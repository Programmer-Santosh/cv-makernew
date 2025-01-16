
var _0x1234 = ["user", "password"];
const users = [
    { username: _0x1234[0], password: _0x1234[1] },
];
function authenticate(_0xa, _0xb) {
    return users.some((_0xc) => _0xc.username === _0xa && _0xc.password === _0xb);
}
