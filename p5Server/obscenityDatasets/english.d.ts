import { DataSet } from '../dataset/DataSet';
import type { RegExpMatcherOptions } from '../matcher/regexp/RegExpMatcher';
/**
 * A set of transformers to be used when matching blacklisted patterns with the
 * [[englishDataset | english word dataset]].
 */
export declare const englishRecommendedBlacklistMatcherTransformers: (import("../transformer/Transformers").SimpleTransformerContainer | import("../transformer/Transformers").StatefulTransformerContainer)[];
/**
 * A set of transformers to be used when matching whitelisted terms with the
 * [[englishDataset | english word dataset]].
 */
export declare const englishRecommendedWhitelistMatcherTransformers: (import("../transformer/Transformers").SimpleTransformerContainer | import("../transformer/Transformers").StatefulTransformerContainer)[];
/**
 * Recommended transformers to be used with the [[englishDataset | english word
 * dataset]] and the [[RegExpMatcher]].
 */
export declare const englishRecommendedTransformers: Pick<RegExpMatcherOptions, 'blacklistMatcherTransformers' | 'whitelistMatcherTransformers'>;
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
export declare const englishDataset: DataSet<{
    originalWord: EnglishProfaneWord;
}>;
/**
 * All the profane words that are included in the [[englishDataset | english dataset]] by default.
 */
export type EnglishProfaneWord = 'abeed' | 'africoon' | 'arabush' | 'bastard' | 'bestiality' | 'boonga' | 'chingchong' | 'chink' | 'fag' | 'nigger' | 'rape' | 'retard' | 'scat' | 'tranny' ;
