// test.js
// Runner for problem1..problem15 modules located in ./problems/problemX.js
// Configure which problem to run: 0 = all
const RUN_PROBLEM = 0; // 0 = all problems

// ----------------------------
// Helpers
// ----------------------------
function assertEqual(actual, expected) {
    // For arrays/objects do deep compare via JSON
    const aJSON = typeof actual === 'object' ? JSON.stringify(actual) : actual;
    const eJSON =
        typeof expected === 'object' ? JSON.stringify(expected) : expected;
    return aJSON === eJSON;
}

function logResult(passed, name, actual, expected) {
    console.log(`${passed ? '✔️ PASS' : '❌ FAIL'} - ${name}`);
    if (!passed) {
        console.log(
            `   Expected: ${JSON.stringify(
                expected
            )}, but got: ${JSON.stringify(actual)}`
        );
    }
}

function captureConsoleLogs(fn) {
    const logs = [];
    const origLog = console.log;
    try {
        console.log = (...args) => {
            // flatten into strings similar to usual console.log spacing
            logs.push(args.join(' '));
        };
        fn();
    } finally {
        console.log = origLog;
    }
    return logs;
}

// join captured logs into one string of tokens separated by spaces (to match test comment style)
function joinCapturedTokens(logs) {
    // each log entry may itself be space-separated; split all tokens and join with single space
    const tokens = [];
    for (const line of logs) {
        const parts = String(line).split(/\s+/).filter(Boolean);
        tokens.push(...parts);
    }
    return tokens.join(' ');
}

// ----------------------------
// Tests definition per problem
// ----------------------------
const problems = [
    {
        id: 1,
        name: 'Problem #1: countDownBy8 (logs)',
        path: './problems/problem1.js',
        run: async (mod) => {
            // expected sequence: start 2019, count down by 8 while > 0
            const expectedTokens = [];
            for (let n = 2019; n > 0; n -= 8) expectedTokens.push(String(n));
            const expectedJoined = expectedTokens.join(' ');
            if (!mod || typeof mod.countDownBy8 !== 'function') {
                return { ok: false, message: 'countDownBy8 not exported' };
            }
            const logs = captureConsoleLogs(() => mod.countDownBy8());
            const actualJoined = joinCapturedTokens(logs);
            const ok = actualJoined === expectedJoined;
            return {
                ok,
                actual: actualJoined,
                expected: expectedJoined,
                name: 'countDownBy8() to log sequence',
            };
        },
    },
    {
        id: 2,
        name: 'Problem #2: celciusToFahrenheit',
        path: './problems/problem2.js',
        run: async (mod) => {
            if (!mod || typeof mod.celciusToFahrenheit !== 'function') {
                return {
                    ok: false,
                    message: 'celciusToFahrenheit not exported',
                };
            }
            const tests = [
                { args: [0], expected: 32 },
                { args: [10], expected: 50 },
                { args: [100], expected: 212 },
            ];
            for (const t of tests) {
                const actual = mod.celciusToFahrenheit(...t.args);
                if (!assertEqual(actual, t.expected)) {
                    return {
                        ok: false,
                        actual,
                        expected: t.expected,
                        name: `celciusToFahrenheit(${t.args[0]})`,
                    };
                }
            }
            return { ok: true };
        },
    },
    {
        id: 3,
        name: 'Problem #3: makeItBig',
        path: './problems/problem3.js',
        run: async (mod) => {
            if (!mod || typeof mod.makeItBig !== 'function') {
                return { ok: false, message: 'makeItBig not exported' };
            }
            const tests = [
                { args: [[-1, 3, 5, -5]], expected: [-1, 'big', 'big', -5] },
                { args: [[2, 4, 6]], expected: ['big', 'big', 'big'] },
                { args: [[-4, 0, 4]], expected: [-4, 0, 'big'] },
            ];
            for (const t of tests) {
                const actual = mod.makeItBig([...t.args[0]]); // copy to avoid in-place surprises
                if (!assertEqual(actual, t.expected)) {
                    return {
                        ok: false,
                        actual,
                        expected: t.expected,
                        name: `makeItBig(${JSON.stringify(t.args[0])})`,
                    };
                }
            }
            return { ok: true };
        },
    },
    {
        id: 4,
        name: 'Problem #4: double',
        path: './problems/problem4.js',
        run: async (mod) => {
            if (!mod || typeof mod.double !== 'function') {
                return { ok: false, message: 'double not exported' };
            }
            const tests = [
                { args: [[1, 2, 3]], expected: [2, 4, 6] },
                { args: [[-2, 0, 2]], expected: [-4, 0, 4] },
                { args: [[2, 10, 100]], expected: [4, 20, 200] },
            ];
            for (const t of tests) {
                const actual = mod.double([...t.args[0]]);
                if (!assertEqual(actual, t.expected)) {
                    return {
                        ok: false,
                        actual,
                        expected: t.expected,
                        name: `double(${JSON.stringify(t.args[0])})`,
                    };
                }
            }
            return { ok: true };
        },
    },
    {
        id: 5,
        name: 'Problem #5: returnArrayCountGreaterThanY',
        path: './problems/problem5.js',
        run: async (mod) => {
            if (
                !mod ||
                typeof mod.returnArrayCountGreaterThanY !== 'function'
            ) {
                return {
                    ok: false,
                    message: 'returnArrayCountGreaterThanY not exported',
                };
            }
            const tests = [
                { args: [[2, 3, 5], 4], expected: 1 },
                { args: [[2, 3, 5], 1], expected: 3 },
                { args: [[4, 10, 15], 10], expected: 1 },
                { args: [[4, 10, 15], 20], expected: 0 },
            ];
            for (const t of tests) {
                const actual = mod.returnArrayCountGreaterThanY(...t.args);
                if (!assertEqual(actual, t.expected)) {
                    return {
                        ok: false,
                        actual,
                        expected: t.expected,
                        name: `returnArrayCountGreaterThanY(${JSON.stringify(
                            t.args
                        )})`,
                    };
                }
            }
            return { ok: true };
        },
    },
    {
        id: 6,
        name: 'Problem #6: sigma',
        path: './problems/problem6.js',
        run: async (mod) => {
            if (!mod || typeof mod.sigma !== 'function') {
                return { ok: false, message: 'sigma not exported' };
            }
            const tests = [
                { args: [3], expected: 6 },
                { args: [5], expected: 15 },
                { args: [6], expected: 21 },
                { args: [8], expected: 36 },
            ];
            for (const t of tests) {
                const actual = mod.sigma(...t.args);
                if (!assertEqual(actual, t.expected)) {
                    return {
                        ok: false,
                        actual,
                        expected: t.expected,
                        name: `sigma(${t.args[0]})`,
                    };
                }
            }
            return { ok: true };
        },
    },
    {
        id: 7,
        name: 'Problem #7: factorial',
        path: './problems/problem7.js',
        run: async (mod) => {
            if (!mod || typeof mod.factorial !== 'function') {
                return { ok: false, message: 'factorial not exported' };
            }
            const tests = [
                { args: [3], expected: 6 },
                { args: [5], expected: 120 },
                { args: [7], expected: 5040 },
                { args: [8], expected: 40320 },
            ];
            for (const t of tests) {
                const actual = mod.factorial(...t.args);
                if (!assertEqual(actual, t.expected)) {
                    return {
                        ok: false,
                        actual,
                        expected: t.expected,
                        name: `factorial(${t.args[0]})`,
                    };
                }
            }
            return { ok: true };
        },
    },
    {
        id: 8,
        name: 'Problem #8: swapTowardCenter',
        path: './problems/problem8.js',
        run: async (mod) => {
            if (!mod || typeof mod.swapTowardCenter !== 'function') {
                return { ok: false, message: 'swapTowardCenter not exported' };
            }
            const tests = [
                {
                    args: [[true, 42, 'Ada', 2, 'pizza']],
                    expected: ['pizza', 2, 'Ada', 42, true],
                },
                { args: [[1, 2, 3, 4, 5, 6]], expected: [6, 5, 4, 3, 2, 1] },
                {
                    args: [['hi', 'coding', 'dojo', 'fans']],
                    expected: ['fans', 'dojo', 'coding', 'hi'],
                },
            ];
            for (const t of tests) {
                const actual = mod.swapTowardCenter([...t.args[0]]);
                if (!assertEqual(actual, t.expected)) {
                    return {
                        ok: false,
                        actual,
                        expected: t.expected,
                        name: `swapTowardCenter(${JSON.stringify(t.args[0])})`,
                    };
                }
            }
            return { ok: true };
        },
    },
    {
        id: 9,
        name: 'Problem #9: threesFives',
        path: './problems/problem9.js',
        run: async (mod) => {
            if (!mod || typeof mod.threesFives !== 'function') {
                return { ok: false, message: 'threesFives not exported' };
            }
            const tests = [
                { args: [10], expected: 22 },
                { args: [15], expected: 60 },
            ];
            for (const t of tests) {
                const actual = mod.threesFives(...t.args);
                if (!assertEqual(actual, t.expected)) {
                    return {
                        ok: false,
                        actual,
                        expected: t.expected,
                        name: `threesFives(${t.args[0]})`,
                    };
                }
            }
            return { ok: true };
        },
    },
    {
        id: 10,
        name: 'Problem #10: sumToOne',
        path: './problems/problem10.js',
        run: async (mod) => {
            if (!mod || typeof mod.sumToOne !== 'function') {
                return { ok: false, message: 'sumToOne not exported' };
            }
            const tests = [
                { args: [35], expected: 8 },
                { args: [928], expected: 1 },
                { args: [5798], expected: 2 },
                { args: [35798], expected: 5 },
            ];
            for (const t of tests) {
                const actual = mod.sumToOne(...t.args);
                if (!assertEqual(actual, t.expected)) {
                    return {
                        ok: false,
                        actual,
                        expected: t.expected,
                        name: `sumToOne(${t.args[0]})`,
                    };
                }
            }
            return { ok: true };
        },
    },
    {
        id: 11,
        name: 'Problem #11: isPrime',
        path: './problems/problem11.js',
        run: async (mod) => {
            if (!mod || typeof mod.isPrime !== 'function') {
                return { ok: false, message: 'isPrime not exported' };
            }
            const tests = [
                { args: [3], expected: true },
                { args: [4], expected: false },
                { args: [13], expected: true },
                { args: [65], expected: false },
                { args: [17], expected: true },
            ];
            for (const t of tests) {
                const actual = mod.isPrime(...t.args);
                if (!assertEqual(actual, t.expected)) {
                    return {
                        ok: false,
                        actual,
                        expected: t.expected,
                        name: `isPrime(${t.args[0]})`,
                    };
                }
            }
            return { ok: true };
        },
    },
    {
        id: 12,
        name: 'Problem #12: filterRange',
        path: './problems/problem12.js',
        run: async (mod) => {
            if (!mod || typeof mod.filterRange !== 'function') {
                return { ok: false, message: 'filterRange not exported' };
            }
            const tests = [
                { args: [[1, 3, 5, 7, 10], 4, 8], expected: [5, 7] },
                { args: [[1, 3, 5, 7, 10], -1, 4], expected: [1, 3] },
                { args: [[2, 4, 3, 5], 2, 6], expected: [4, 3, 5] },
                { args: [[2, 4, 3, 5], 0, 4], expected: [2, 3] },
                { args: [[6, 2, -3, 5, 7], 3, 8], expected: [6, 5, 7] },
            ];
            for (const t of tests) {
                // call with a copy in case implementation mutates the array
                const arrCopy = [...t.args[0]];
                const actual = mod.filterRange(arrCopy, t.args[1], t.args[2]);
                if (!assertEqual(actual, t.expected)) {
                    return {
                        ok: false,
                        actual,
                        expected: t.expected,
                        name: `filterRange(${JSON.stringify(t.args[0])}, ${
                            t.args[1]
                        }, ${t.args[2]})`,
                    };
                }
            }
            return { ok: true };
        },
    },
    {
        id: 13,
        name: 'Problem #13: arrayConcat',
        path: './problems/problem13.js',
        run: async (mod) => {
            if (!mod || typeof mod.arrayConcat !== 'function') {
                return { ok: false, message: 'arrayConcat not exported' };
            }
            const tests = [
                {
                    args: [
                        [1, 2],
                        [3, 4],
                    ],
                    expected: [1, 2, 3, 4],
                },
                {
                    args: [
                        [1, 2],
                        [3, 4, 5],
                    ],
                    expected: [1, 2, 3, 4, 5],
                },
                {
                    args: [
                        [1, 2, 3],
                        [3, 4, 5, 6],
                    ],
                    expected: [1, 2, 3, 3, 4, 5, 6],
                },
                { args: [[-1], [-5, 3]], expected: [-1, -5, 3] },
            ];
            for (const t of tests) {
                const actual = mod.arrayConcat([...t.args[0]], [...t.args[1]]);
                if (!assertEqual(actual, t.expected)) {
                    return {
                        ok: false,
                        actual,
                        expected: t.expected,
                        name: `arrayConcat(${JSON.stringify(
                            t.args[0]
                        )}, ${JSON.stringify(t.args[1])})`,
                    };
                }
            }
            return { ok: true };
        },
    },
    {
        id: 14,
        name: 'Problem #14: secondToLast',
        path: './problems/problem14.js',
        run: async (mod) => {
            if (!mod || typeof mod.secondToLast !== 'function') {
                return { ok: false, message: 'secondToLast not exported' };
            }
            const tests = [
                { args: [[42, true, 4, 'Kate', 7]], expected: 'Kate' },
                { args: [[42, true, 4, 'Kate', 7, 9]], expected: 7 },
                {
                    args: [[42, true, 4, 'Kate', 7, 9, 'dojo', 'awesome']],
                    expected: 'dojo',
                },
                { args: [[1]], expected: null },
            ];
            for (const t of tests) {
                const actual = mod.secondToLast([...t.args[0]]);
                if (!assertEqual(actual, t.expected)) {
                    return {
                        ok: false,
                        actual,
                        expected: t.expected,
                        name: `secondToLast(${JSON.stringify(t.args[0])})`,
                    };
                }
            }
            return { ok: true };
        },
    },
    {
        id: 15,
        name: 'Problem #15: zipIt',
        path: './problems/problem15.js',
        run: async (mod) => {
            if (!mod || typeof mod.zipIt !== 'function') {
                return { ok: false, message: 'zipIt not exported' };
            }
            const tests = [
                {
                    args: [
                        [1, 2],
                        [10, 20, 30, 40],
                    ],
                    expected: [1, 10, 2, 20, 30, 40],
                },
                {
                    args: [
                        [1, 2, 3, 4],
                        [10, 20],
                    ],
                    expected: [1, 10, 2, 20, 3, 4],
                },
                {
                    args: [
                        [1, 2, 3, 4],
                        [10, 20, 30, 40],
                    ],
                    expected: [1, 10, 2, 20, 3, 30, 4, 40],
                },
                { args: [[1], [10, 20]], expected: [1, 10, 20] },
                { args: [[1, 2, 3], [10]], expected: [1, 10, 2, 3] },
            ];
            for (const t of tests) {
                const actual = mod.zipIt([...t.args[0]], [...t.args[1]]);
                if (!assertEqual(actual, t.expected)) {
                    return {
                        ok: false,
                        actual,
                        expected: t.expected,
                        name: `zipIt(${JSON.stringify(
                            t.args[0]
                        )}, ${JSON.stringify(t.args[1])})`,
                    };
                }
            }
            return { ok: true };
        },
    },
];

// ----------------------------
// Runner
// ----------------------------
(async function main() {
    if (RUN_PROBLEM === 0) {
        console.log('Running ALL problems');
        for (const p of problems) {
            console.log(`\n=== ${p.name} ===`);
            try {
                let mod;
                try {
                    mod = await import(p.path);
                } catch (e) {
                    console.log(
                        `Module ${p.path} not found or failed to import: ${e.message}`
                    );
                    continue;
                }
                const res = await p.run(mod);
                if (res === undefined) {
                    console.log('No test result returned for this problem.');
                    continue;
                }
                if (res.ok) {
                    console.log('✔️ ALL TESTS PASSED for', p.name);
                } else {
                    if (res.message) {
                        console.log('❌', res.message);
                    } else {
                        logResult(
                            false,
                            res.name || p.name,
                            res.actual,
                            res.expected
                        );
                    }
                }
            } catch (err) {
                console.log('Error running tests for', p.name, err);
            }
        }
    } else {
        const p = problems.find((x) => x.id === RUN_PROBLEM);
        if (!p) {
            console.log(`Problem #${RUN_PROBLEM} not found`);
            return;
        }
        console.log(`Running ${p.name}`);
        try {
            let mod;
            try {
                mod = await import(p.path);
            } catch (e) {
                console.log(
                    `Module ${p.path} not found or failed to import: ${e.message}`
                );
                return;
            }
            const res = await p.run(mod);
            if (res.ok) {
                console.log('✔️ ALL TESTS PASSED for', p.name);
            } else {
                if (res.message) {
                    console.log('❌', res.message);
                } else {
                    logResult(
                        false,
                        res.name || p.name,
                        res.actual,
                        res.expected
                    );
                }
            }
        } catch (err) {
            console.log('Error running tests for', p.name, err);
        }
    }
})();
