"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.englishDataset = exports.englishRecommendedTransformers = exports.englishRecommendedWhitelistMatcherTransformers = exports.englishRecommendedBlacklistMatcherTransformers = void 0;
const DataSet_1 = require("../dataset/DataSet");
const Pattern_1 = require("../pattern/Pattern");
const collapse_duplicates_1 = require("../transformer/collapse-duplicates");
const resolve_confusables_1 = require("../transformer/resolve-confusables");
const resolve_leetspeak_1 = require("../transformer/resolve-leetspeak");
const to_ascii_lowercase_1 = require("../transformer/to-ascii-lowercase");
/**
 * A set of transformers to be used when matching blacklisted patterns with the
 * [[englishDataset | english word dataset]].
 */
exports.englishRecommendedBlacklistMatcherTransformers = [
    (0, resolve_confusables_1.resolveConfusablesTransformer)(),
    (0, resolve_leetspeak_1.resolveLeetSpeakTransformer)(),
    (0, to_ascii_lowercase_1.toAsciiLowerCaseTransformer)(),
    // See #23 and #46.
    // skipNonAlphabeticTransformer(),
    (0, collapse_duplicates_1.collapseDuplicatesTransformer)({
        defaultThreshold: 1,
        customThresholds: new Map([
            ['b', 2],
            ['e', 2],
            ['o', 2],
            ['l', 2],
            ['s', 2],
            ['g', 2], // ni_gg_er
        ]),
    }),
];
/**
 * A set of transformers to be used when matching whitelisted terms with the
 * [[englishDataset | english word dataset]].
 */
exports.englishRecommendedWhitelistMatcherTransformers = [
    (0, to_ascii_lowercase_1.toAsciiLowerCaseTransformer)(),
    (0, collapse_duplicates_1.collapseDuplicatesTransformer)({
        defaultThreshold: Number.POSITIVE_INFINITY,
        customThresholds: new Map([[' ', 1]]), // collapse spaces
    }),
];
/**
 * Recommended transformers to be used with the [[englishDataset | english word
 * dataset]] and the [[RegExpMatcher]].
 */
exports.englishRecommendedTransformers = {
    blacklistMatcherTransformers: exports.englishRecommendedBlacklistMatcherTransformers,
    whitelistMatcherTransformers: exports.englishRecommendedWhitelistMatcherTransformers,
};
/**
 * A dataset of profane English words.
 *
 * @example
 * ```typescript
 * const matcher = new RegExpMatcher({
 * 	...englishDataset.build(),
 * 	...englishRecommendedTransformers,
 * });
 * ```
 * @example
 * ```typescript
 * // Extending the data-set by adding a new word and removing an existing one.
 * const myDataset = new DataSet()
 * 	.addAll(englishDataset)
 * 	.removePhrasesIf((phrase) => phrase.metadata.originalWord === 'vagina')
 * 	.addPhrase((phrase) => phrase.addPattern(pattern`|balls|`));
 * ```
 * @copyright
 * The words are taken from the [cuss](https://github.com/words/cuss) project,
 * with some modifications.
 *
 * ```text
 * (The MIT License)
 *
 * Copyright (c) 2016 Titus Wormer <tituswormer@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
exports.englishDataset = new DataSet_1.DataSet()
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'abbo' })
    // .addPattern((0, Pattern_1.pattern) `abbo`)
    // .addWhitelistedTerm('abbot'))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'abeed' }).addPattern((0, Pattern_1.pattern) `ab[b]eed`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'africoon' }).addPattern((0, Pattern_1.pattern) `africoon`))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'anal' })
    // .addPattern((0, Pattern_1.pattern) `|anal`)
    // .addWhitelistedTerm('analabos')
    // .addWhitelistedTerm('analagous')
    // .addWhitelistedTerm('analav')
    // .addWhitelistedTerm('analy')
    // .addWhitelistedTerm('analog')
    // .addWhitelistedTerm('an al')
    // .addPattern((0, Pattern_1.pattern) `danal`)
    // .addPattern((0, Pattern_1.pattern) `eanal`)
    // .addPattern((0, Pattern_1.pattern) `fanal`)
    // .addWhitelistedTerm('fan al')
    // .addPattern((0, Pattern_1.pattern) `ganal`)
    // .addWhitelistedTerm('gan al')
    // .addPattern((0, Pattern_1.pattern) `ianal`)
    // .addWhitelistedTerm('ian al')
    // .addPattern((0, Pattern_1.pattern) `janal`)
    // .addWhitelistedTerm('trojan al')
    // .addPattern((0, Pattern_1.pattern) `kanal`)
    // .addPattern((0, Pattern_1.pattern) `lanal`)
    // .addWhitelistedTerm('lan al')
    // .addPattern((0, Pattern_1.pattern) `lanal`)
    // .addWhitelistedTerm('lan al')
    // .addPattern((0, Pattern_1.pattern) `oanal|`)
    // .addPattern((0, Pattern_1.pattern) `panal`)
    // .addWhitelistedTerm('pan al')
    // .addPattern((0, Pattern_1.pattern) `qanal`)
    // .addPattern((0, Pattern_1.pattern) `ranal`)
    // .addPattern((0, Pattern_1.pattern) `sanal`)
    // .addPattern((0, Pattern_1.pattern) `tanal`)
    // .addWhitelistedTerm('tan al')
    // .addPattern((0, Pattern_1.pattern) `uanal`)
    // .addWhitelistedTerm('uan al')
    // .addPattern((0, Pattern_1.pattern) `vanal`)
    // .addWhitelistedTerm('van al')
    // .addPattern((0, Pattern_1.pattern) `wanal`)
    // .addPattern((0, Pattern_1.pattern) `xanal`)
    // .addWhitelistedTerm('texan al')
    // .addPattern((0, Pattern_1.pattern) `yanal`)
    // .addPattern((0, Pattern_1.pattern) `zanal`))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'anus' })
    // .addPattern((0, Pattern_1.pattern) `anus`)
    // .addWhitelistedTerm('an us')
    // .addWhitelistedTerm('tetanus')
    // .addWhitelistedTerm('uranus')
    // .addWhitelistedTerm('janus')
    // .addWhitelistedTerm('manus'))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'arabush' }).addPattern((0, Pattern_1.pattern) `arab[b]ush`))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'arse' })
    // .addPattern((0, Pattern_1.pattern) `|ars[s]e`)
    // .addWhitelistedTerm('arsen'))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'ass' })
    // .addPattern((0, Pattern_1.pattern) `|ass`)
    // .addWhitelistedTerm('assa')
    // .addWhitelistedTerm('assem')
    // .addWhitelistedTerm('assen')
    // .addWhitelistedTerm('asser')
    // .addWhitelistedTerm('asset')
    // .addWhitelistedTerm('assev')
    // .addWhitelistedTerm('assi')
    // .addWhitelistedTerm('assoc')
    // .addWhitelistedTerm('assoi')
    // .addWhitelistedTerm('assu'))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'bestiality' }).addPattern((0, Pattern_1.pattern) `be[e]s[s]tial`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'bastard' }).addPattern((0, Pattern_1.pattern) `bas[s]tard`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'boob' }).addPattern((0, Pattern_1.pattern) `boob`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'boonga' })
    .addPattern((0, Pattern_1.pattern) `boonga`)
    .addWhitelistedTerm('baboon ga'))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'bitch' })
    // .addPattern((0, Pattern_1.pattern) `bitch`)
    // .addPattern((0, Pattern_1.pattern) `bich|`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'blowjob' }).addPattern((0, Pattern_1.pattern) `b[b]l[l][o]wj[o]b`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'chingchong' }).addPattern((0, Pattern_1.pattern) `chingchong`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'chink' })
    .addPattern((0, Pattern_1.pattern) `chink`)
    .addWhitelistedTerm('chin k'))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'cock' })
    // .addPattern((0, Pattern_1.pattern) `|cock|`)
    // .addPattern((0, Pattern_1.pattern) `|cocks`)
    // .addPattern((0, Pattern_1.pattern) `|cockp`)
    // .addPattern((0, Pattern_1.pattern) `|cocke[e]|`)
    // .addWhitelistedTerm('cockney'))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'cum' })
    // .addPattern((0, Pattern_1.pattern) `|cum`)
    // .addWhitelistedTerm('cumu')
    // .addWhitelistedTerm('cumb'))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'cunt' }).addPattern((0, Pattern_1.pattern) `|cunt`))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'deepthroat' })
    // .addPattern((0, Pattern_1.pattern) `deepthro[o]at`)
    // .addPattern((0, Pattern_1.pattern) `deepthro[o]t`))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'dick' })
    // .addPattern((0, Pattern_1.pattern) `d?ck|`)
    // .addPattern((0, Pattern_1.pattern) `d?cke[e]s|`)
    // .addPattern((0, Pattern_1.pattern) `d?cks|`)
    // .addPattern((0, Pattern_1.pattern) `|dck|`)
    // .addPattern((0, Pattern_1.pattern) `dick`)
    // .addWhitelistedTerm('benedick')
    // .addWhitelistedTerm('dickens'))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'doggystyle' }).addPattern((0, Pattern_1.pattern) `d[o]g[g]ys[s]t[y]l[l]`))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'ejaculate' })
    // .addPattern((0, Pattern_1.pattern) `e[e]jacul`)
    // .addPattern((0, Pattern_1.pattern) `e[e]jakul`)
    // .addPattern((0, Pattern_1.pattern) `e[e]acul[l]ate`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'fag' })
    .addPattern((0, Pattern_1.pattern) `|fag`)
    .addPattern((0, Pattern_1.pattern) `fggot`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'fellatio' }).addPattern((0, Pattern_1.pattern) `f[e][e]llat`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'felch' }).addPattern((0, Pattern_1.pattern) `fe[e]l[l]ch`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'fisting' }).addPattern((0, Pattern_1.pattern) `fistin`))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'fuck' })
    // .addPattern((0, Pattern_1.pattern) `f[?]ck`)
    // .addPattern((0, Pattern_1.pattern) `|fk`)
    // .addPattern((0, Pattern_1.pattern) `|fu|`)
    // .addPattern((0, Pattern_1.pattern) `|fuk`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'gangbang' }).addPattern((0, Pattern_1.pattern) `g[?]ngbang`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'handjob' }).addPattern((0, Pattern_1.pattern) `h[?]ndjob`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'jizz' }).addPattern((0, Pattern_1.pattern) `jizz`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'lubejob' }).addPattern((0, Pattern_1.pattern) `lubejob`))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'masturbate' })
    // .addPattern((0, Pattern_1.pattern) `m[?]sturbate`)
    // .addPattern((0, Pattern_1.pattern) `masterbate`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'nigger' })
    .addPattern((0, Pattern_1.pattern) `n[i]gger`)
    .addPattern((0, Pattern_1.pattern) `n[i]gga`)
    .addPattern((0, Pattern_1.pattern) `|nig|`)
    .addPattern((0, Pattern_1.pattern) `|nigs|`)
    .addWhitelistedTerm('snigger'))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'orgasm' })
    // .addPattern((0, Pattern_1.pattern) `[or]gasm`)
    // .addWhitelistedTerm('gasma'))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'orgy' })
    // .addPattern((0, Pattern_1.pattern) `orgy`)
    // .addPattern((0, Pattern_1.pattern) `orgies`)
    // .addWhitelistedTerm('porgy'))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'porn' })
    // .addPattern((0, Pattern_1.pattern) `|prn|`)
    // .addPattern((0, Pattern_1.pattern) `porn`)
    // .addWhitelistedTerm('p orna'))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'hentai' }).addPattern((0, Pattern_1.pattern) `h[e][e]ntai`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'pussy' }).addPattern((0, Pattern_1.pattern) `p[u]ssy`))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'vagina' })
    // .addPattern((0, Pattern_1.pattern) `vagina`)
    // .addPattern((0, Pattern_1.pattern) `|v[?]gina`))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'penis' })
    // .addPattern((0, Pattern_1.pattern) `pe[e]nis`)
    // .addPattern((0, Pattern_1.pattern) `|pnis`)
    // .addWhitelistedTerm('pen is'))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'rape' })
    .addPattern((0, Pattern_1.pattern) `|rape`)
    .addPattern((0, Pattern_1.pattern) `|rapis[s]t`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'retard' }).addPattern((0, Pattern_1.pattern) `retard`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'scat' }).addPattern((0, Pattern_1.pattern) `|s[s]cat|`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'slut' }).addPattern((0, Pattern_1.pattern) `s[s]lut`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'semen' }).addPattern((0, Pattern_1.pattern) `|s[s]e[e]me[e]n`))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'sex' })
    // .addPattern((0, Pattern_1.pattern) `|s[s]e[e]x|`)
    // .addPattern((0, Pattern_1.pattern) `|s[s]e[e]xy|`))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'shit' })
    // .addPattern((0, Pattern_1.pattern) `shit`)
    // .addWhitelistedTerm('s hit')
    // .addWhitelistedTerm('sh it')
    // .addWhitelistedTerm('shi t')
    // .addWhitelistedTerm('shitake')
    // .addWhitelistedTerm('mishit'))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'tit' })
    // .addPattern((0, Pattern_1.pattern) `|tit|`)
    // .addPattern((0, Pattern_1.pattern) `|tits|`)
    // .addPattern((0, Pattern_1.pattern) `|titt`)
    // .addPattern((0, Pattern_1.pattern) `|tiddies`)
    // .addPattern((0, Pattern_1.pattern) `|tities`))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'whore' })
    // .addPattern((0, Pattern_1.pattern) `|wh[o]re|`)
    // .addPattern((0, Pattern_1.pattern) `|who[o]res[s]|`)
    // .addWhitelistedTerm("who're"))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'dildo' }).addPattern((0, Pattern_1.pattern) `dildo`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'double penetration' }).addPattern((0, Pattern_1.pattern) `double penetra`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'finger bang' }).addPattern((0, Pattern_1.pattern) `fingerbang`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'hooker' }).addPattern((0, Pattern_1.pattern) `hooker`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'jerk off' }).addPattern((0, Pattern_1.pattern) `jerkoff`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'incest' }).addPattern((0, Pattern_1.pattern) `incest`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'tranny' }).addPattern((0, Pattern_1.pattern) `tranny`))
    // .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'buttplug' }).addPattern((0, Pattern_1.pattern) `buttplug`))
    // .addPhrase((phrase) => phrase
    // .setMetadata({ originalWord: 'cuck' })
    // .addPattern((0, Pattern_1.pattern) `cuck`)
    // .addWhitelistedTerm('cuckoo'));
