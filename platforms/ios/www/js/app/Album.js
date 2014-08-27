CQ.Album = {
    TOTAL_ALBUM: 1,

    Category: {
        Film: { id: 1, name: '映画' },
        Series: { id: 2, name: 'ドラマ' },
        Cartoon: { id: 3, name: '漫画' },
        Entertainer: { id: 4, name: '芸能人' },
        Brand: { id: 5, name: 'ブランド' },
        Celebrity: { id: 6, name: '有名人' },
        Game: { id: 7, name: 'ゲーム' },
        Sports: { id: 8, name: 'スポーツ' },
        Animation: { id: 9, name: 'アニメ' },
        Building: { id: 10, name: '建物' },
        History: { id: 11, name: '歴史' },
        Place: { id: 12, name: '場所' },
        Geography: { id: 13, name: '地理' }
    },

    AnswerType: {
        English: { id: 1, pictures: [] },
        Kanji: { id: 2, pictures: [] },
        Hiragana: { id: 3, pictures: [] },
        Katakana: { id: 4, pictures: [] },
        Mix: { id: 5, pictures: [] }
    },

    init: function() {
        if (CQ.dev) {
            // this logic is only been used for generating picture answers during development
            for (var i = 1; i <= 6; i++)
                for (var j = 0; j < 20; j++) {
                    var picture = this.getPicture(this.getPictureId(i, j));

                    if (CQ.Album.AnswerType.English === picture.type)
                        CQ.Album.AnswerType.English.pictures.push(picture);
                    else if (CQ.Album.AnswerType.Kanji === picture.type)
                        CQ.Album.AnswerType.Kanji.pictures.push(picture);
                    else if (CQ.Album.AnswerType.Hiragana === picture.type)
                        CQ.Album.AnswerType.Hiragana.pictures.push(picture);
                    else if (CQ.Album.AnswerType.Katakana === picture.type)
                        CQ.Album.AnswerType.Katakana.pictures.push(picture);
                    else {
                        // does not support auto generate answers for this type
                    }
                }
        }
    },

    getAlbum: function(id) {
        switch (id) {
            case CQ.Album.Default.id:
                return CQ.Album.Default;
            default:
                return null;
        }
    },

    isAlbumLocked: function(id) {
        return id > CQ.Datastore.Picture.getLastAlbumId();
    },

    unlockAlbum: function(albumId, isPurchase) {
        console.log('Unlock album {0}, is purchase: {1}'.format(albumId, isPurchase));
        var lastAlbumId = CQ.Datastore.Picture.getLastAlbumId();

        if (albumId > this.TOTAL_ALBUM) {
            console.info('There is no such album to unlock.');
            return false;
        } else if (albumId != (lastAlbumId + 1)) {
            console.error('Incorrect unlock album {0}, last album {1}'.format(albumId, lastAlbumId));
            return false;
        }

        if (!isPurchase || CQ.Currency.consume(CQ.Currency.Consume.UnlockAlbum, albumId)) {
            CQ.Datastore.Picture.setLastAlbumId(albumId);
            CQ.Page.Main.refreshCurrency();
            CQ.Page.Main.enableAlbum(albumId);

            if (isPurchase) CQ.GA.track(CQ.GA.Album.UnlockPurchase, CQ.GA.Album.UnlockPurchase.label.format(albumId));
            else CQ.GA.track(CQ.GA.Album.Unlock, CQ.GA.Album.Unlock.label.format(albumId));

            return true;
        } else return false;
    },

    getLevel: function(level) {
        return this.levels[level - 1];
    },

    unlockLevel: function(albumId, level, isPurchase) {
        console.log('Unlock album {0} level {1}, is purchase: {2}'.format(albumId, level, isPurchase));
        var lastLevel = CQ.Datastore.Picture.getLastLevel(albumId), album = CQ.Album.getAlbum(albumId);

        if (level > album.levels.length) {
            console.info('There is no such level to unlock.');
            return false;
        } else if (level != (lastLevel + 1)) {
            console.info('Incorrect unlock level {0}, last level {1}'.format(level, lastLevel));
            return false;
        }

        if (!isPurchase || CQ.Currency.consume(CQ.Currency.Consume.UnlockLevel, albumId, level)) {
            CQ.Datastore.Picture.setLastLevel(albumId, level);
            CQ.Page.Main.refreshCurrency();
            CQ.Page.Main.enableLevel(albumId, level);

            if (isPurchase) CQ.GA.track(CQ.GA.Level.UnlockPurchase, CQ.GA.Level.UnlockPurchase.label.format(albumId, level));
            else CQ.GA.track(CQ.GA.Level.Unlock, CQ.GA.Level.Unlock.label.format(albumId, level));

            return true;
        } else return false;
    },

    getPicture: function(id) {
        var levelAndIndex = this.getPictureLevelAndIndex(id);
        return this.levels[levelAndIndex.level - 1].pictures[levelAndIndex.index];
    },

    getPictureId: function(level, index) {
        return parseInt(level.toString() + (index >= 10 ? index : '0' + index));
    },

    getPicturePath: function(id) {
        return '{0}{1}.jpg'.format(this.path, id);
    },

    getPictureLevelAndIndex: function(id) {
        var idString = id.toString();
        return {
            level: idString.charAt(0),
            index: parseInt(idString.substring(1, 3), 10)
        }
    },

    getFirstPicture: function(level) {
        return this.levels[level - 1].pictures[0];
    },

    getNextPicture: function(id) {
        var levelAndIndex = this.getPictureLevelAndIndex(id), level = this.levels[levelAndIndex.level - 1];
        return levelAndIndex.index >= level.pictures.length ? null : level.pictures[levelAndIndex.index + 1];
    },

    getAlternativeAnswerChars: function(pictureId, length) {
        var picture = this.getPicture(pictureId),
            chars = picture.name.split(''),
            answerIds = picture.answers,
            remainingChars = length - picture.name.length,
            alternativeAnswers = [pictureId];

        if (answerIds.length > 0) {
            // has alternative answers defined
            for (var i = 0; (remainingChars > 0) && (answerIds.length > i); i++) {
                var alternativePictureId = answerIds[i],
                    alternativeChars = this.getPicture(alternativePictureId).name;

                if (remainingChars > alternativeChars.length) {
                    chars = chars.concat(alternativeChars.split(''));
                    alternativeAnswers.push(alternativePictureId);
                    remainingChars -= alternativeChars.length;
                } else if (remainingChars == alternativeChars.length) {
                    chars = chars.concat(alternativeChars.split(''));
                    alternativeAnswers.push(alternativePictureId);
                    break;
                } else {
                    chars = chars.concat(alternativeChars.split('').slice(0, remainingChars));
                    break;
                }
            }
        } else {
            // no alternative answers, generate random chars
            while (remainingChars > 0) {
                // generate random picture id which does not been used
                var candidates = null;

                if (CQ.Album.AnswerType.English === picture.type)
                    candidates = CQ.Album.AnswerType.English.pictures;
                else if (CQ.Album.AnswerType.Kanji === picture.type)
                    candidates = CQ.Album.AnswerType.Kanji.pictures
                        .concat(CQ.Album.AnswerType.Mix.pictures);
                else if (CQ.Album.AnswerType.Katakana === picture.type)
                    candidates = CQ.Album.AnswerType.Katakana.pictures
                        .concat(CQ.Album.AnswerType.Mix.pictures);
                else
                    candidates = CQ.Album.AnswerType.Kanji.pictures
                        .concat(CQ.Album.AnswerType.Hiragana.pictures)
                        .concat(CQ.Album.AnswerType.Katakana.pictures)
                        .concat(CQ.Album.AnswerType.Mix.pictures);

                var randomIndex = Math.floor(Math.random() * candidates.length);
                console.info("Candidates length: {0}, Random index: {1}".format(candidates.length, randomIndex));
                var randomPicture = candidates[randomIndex], randomId = randomPicture.id;

                if ($.inArray(randomId, alternativeAnswers) == -1) {
                    var randomName = this.getPicture(randomId).name;

                    // get characters from random picture name
                    if (remainingChars > randomName.length) {
                        chars = chars.concat(randomName.split(''));
                        alternativeAnswers.push(randomId);
                        remainingChars -= randomName.length;
                    } else if (remainingChars == randomName.length) {
                        chars = chars.concat(randomName.split(''));
                        alternativeAnswers.push(randomId);
                        break;
                    } else {
                        chars = chars.concat(randomName.split('').slice(0, remainingChars));
                        break;
                    }
                }
            }
        }

        console.log('Generated random chars from pictures: ' + alternativeAnswers.join(', '));

        return {
            chars: CQ.Album.shuffle(chars),
            alternativeAnswers: alternativeAnswers
        };
    },

    shuffle: function(arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    }
};

CQ.Album.Default = {
    id: 1,
    name: 'クラシック',
    path: 'img/album/default/',
    active: true,

    levels: [
        {
            level: 1,
            name: 'ステージ１',
            pictures: [
                { id: 100, name: 'ロナウド', category: CQ.Album.Category.Sports, type: CQ.Album.AnswerType.Katakana, answers: [506, 618, 104, 319, 315, 203] },
                { id: 101, name: '通天閣', category: CQ.Album.Category.Building, type: CQ.Album.AnswerType.Kanji, answers: [612, 611, 216, 609, 414, 604, 614, 607, 403] },
                { id: 102, name: 'ワンピース', category: CQ.Album.Category.Animation, type: CQ.Album.AnswerType.Katakana, answers: [311, 404, 517, 100] },
                { id: 103, name: 'ジョーダン', category: CQ.Album.Category.Sports, type: CQ.Album.AnswerType.Katakana, answers: [506, 513, 100, 315, 417] },
                { id: 104, name: 'シドニー', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [212, 600, 407, 400, 519] },
                { id: 105, name: 'スーパーマリオ', category: CQ.Album.Category.Game, type: CQ.Album.AnswerType.Katakana, answers: [100, 300, 112, 407, 212] },
                { id: 106, name: 'SMAP', category: CQ.Album.Category.Entertainer, type: CQ.Album.AnswerType.English, answers: [515, 304, 406, 119, 108, 307] },
                { id: 107, name: 'アバター', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [314, 401, 504, 603, 610] },
                { id: 108, name: 'CHANEL', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.English, answers: [307, 214, 304, 515, 201] },
                { id: 109, name: 'FACEBOOK', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.English, answers: [307, 119, 304, 206, 515, 106] },
                { id: 110, name: 'ジョブズ', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [217, 318, 310, 416, 300, 501] },
                { id: 111, name: 'オバマ', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [519, 505, 116, 512, 113] },
                { id: 112, name: 'アメリ', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [405, 619, 107, 600, 519, 501, 313, 509] },
                { id: 113, name: 'ロレックス', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [502, 417, 313, 210] },
                { id: 114, name: 'ジョニーデップ', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [318, 501, 400, 407] },
                { id: 115, name: '相棒', category: CQ.Album.Category.Series, type: CQ.Album.AnswerType.Kanji, answers: [207, 403, 604, 101, 607, 419, 218, 609] },
                { id: 116, name: 'トロイ', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [410, 100, 417, 306, 105] },
                { id: 117, name: 'ロッテリア', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [407, 618, 100, 319] },
                { id: 118, name: '千と千尋の神隠し', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Mix, answers: [418, 301, 412, 614] },
                { id: 119, name: 'SONY', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.English, answers: [214, 206, 109, 515, 307] }
            ]
        },
        {
            level: 2,
            name: 'ステージ２',
            pictures: [
                { id: 200, name: 'ガンダム', category: CQ.Album.Category.Animation, type: CQ.Album.AnswerType.Katakana, answers: [509, 113, 211, 312, 309] },
                { id: 201, name: 'YAHOO', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.English, answers: [109, 406, 304, 214, 206] },
                { id: 202, name: 'スターバックス', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [111, 513, 506, 511, 315, 502] },
                { id: 203, name: 'アマゾン', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [504, 313, 405, 610, 103] },
                { id: 204, name: 'うまい棒', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Mix, answers: [418, 205, 414, 507, 615, 410] },
                { id: 205, name: 'マイケル', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [618, 213, 104, 316, 113, 217] },
                { id: 206, name: 'ADIDAS', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.English, answers: [214, 307, 109, 119, 201] },
                { id: 207, name: '浅田真央', category: CQ.Album.Category.Sports, type: CQ.Album.AnswerType.Kanji, answers: [414, 609, 611, 115, 613, 514, 218, 607] },
                { id: 208, name: 'ワシントン', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [309, 418, 509, 603] },
                { id: 209, name: 'タイタニック', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [404, 103, 415, 312] },
                { id: 210, name: 'リンカーン', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [519, 600, 508, 512, 516] },
                { id: 211, name: 'アンダーワールド', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [210, 415, 407] },
                { id: 212, name: 'ポケモン', category: CQ.Album.Category.Game, type: CQ.Album.AnswerType.Katakana, answers: [412, 501, 210, 318, 315] },
                { id: 213, name: 'ロンドン', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [517, 519, 203, 404, 501] },
                { id: 214, name: 'WENDYS', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.English, answers: [515, 307, 119, 109, 106, 304] },
                { id: 215, name: '金閣寺', category: CQ.Album.Category.Building, type: CQ.Album.AnswerType.Kanji, answers: [101, 607, 218, 207, 403, 219, 609] },
                { id: 216, name: '貞子', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Kanji, answers: [218, 514, 101, 215, 609, 414, 219, 207] },
                { id: 217, name: 'ブラジル', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [314, 610, 114, 603] },
                { id: 218, name: '半沢直樹', category: CQ.Album.Category.Series, type: CQ.Album.AnswerType.Kanji, answers: [613, 514, 403, 101, 219, 414, 614, 612] },
                { id: 219, name: '歌舞伎町一番街', category: CQ.Album.Category.Place, type: CQ.Album.AnswerType.Kanji, answers: [419, 215, 613, 609, 414, 614, 607] }
            ]
        },
        {
            level: 3,
            name: 'ステージ３',
            pictures: [
                { id: 300, name: 'スカイツリー', category: CQ.Album.Category.Building, type: CQ.Album.AnswerType.Katakana, answers: [412, 519, 310, 104, 601, 410] },
                { id: 301, name: 'モスバーガー', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [400, 117, 404, 401] },
                { id: 302, name: 'ドラえもん', category: CQ.Album.Category.Cartoon, type: CQ.Album.AnswerType.Mix, answers: [618, 507, 317, 418] },
                { id: 303, name: 'ソフトバンク犬', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Mix, answers: [114, 315, 107, 317] },
                { id: 304, name: 'LV', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.English, answers: [201, 406, 109, 307, 515] },
                { id: 305, name: 'サウスパーク', category: CQ.Album.Category.Animation, type: CQ.Album.AnswerType.Katakana, answers: [504, 309, 209, 217] },
                { id: 306, name: 'アイアンマン', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [316, 301, 418, 312] },
                { id: 307, name: 'BMW', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.English, answers: [406, 106, 201, 108, 119] },
                { id: 308, name: '忍者タートルズ', category: CQ.Album.Category.Animation, type: CQ.Album.AnswerType.Mix, answers: [504, 215, 216, 607, 403, 512] },
                { id: 309, name: 'キャデラック', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [301, 512, 412, 205, 316] },
                { id: 310, name: 'ユベントス', category: CQ.Album.Category.Sports, type: CQ.Album.AnswerType.Katakana, answers: [316, 105, 418, 208] },
                { id: 311, name: 'アイスエイジ', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [102, 501, 202, 418, 111] },
                { id: 312, name: 'ビルゲイツ', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [507, 117, 407, 509, 513] },
                { id: 313, name: 'ヴェネツィア', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [412, 100, 212, 306, 117] },
                { id: 314, name: 'インセプション', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [318, 205, 103, 208, 519] },
                { id: 315, name: 'マツコデラックス', category: CQ.Album.Category.Entertainer, type: CQ.Album.AnswerType.Katakana, answers: [410, 401, 618, 117, 212, 112] },
                { id: 316, name: 'マクドナルド', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [507, 309, 610, 111, 405] },
                { id: 317, name: 'バルセロナ', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [315, 615, 509, 103, 117] },
                { id: 318, name: 'バーミヤン', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [208, 512, 502, 615, 311] },
                { id: 319, name: 'マリーキュリー', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [317, 203, 314, 315] }
            ]
        },
        {
            level: 4,
            name: 'ステージ４',
            pictures: [
                { id: 400, name: 'アインシュタイン', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [501, 319, 315] },
                { id: 401, name: 'ソニック', category: CQ.Album.Category.Game, type: CQ.Album.AnswerType.Katakana, answers: [409, 506, 407, 317, 300] },
                { id: 402, name: 'ちびまる子ちゃん', category: CQ.Album.Category.Animation, type: CQ.Album.AnswerType.Mix, answers: [209, 506, 615, 200, 104] },
                { id: 403, name: '野口英世', category: CQ.Album.Category.History, type: CQ.Album.AnswerType.Kanji, answers: [607, 115, 419, 604, 414, 101, 614, 514] },
                { id: 404, name: 'ハーゲンダッツ', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [117, 603, 113, 610, 506] },
                { id: 405, name: 'ローマ', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [117, 502, 107, 205, 314] },
                { id: 406, name: 'LOST', category: CQ.Album.Category.Series, type: CQ.Album.AnswerType.English, answers: [109, 307, 201, 206, 108] },
                { id: 407, name: 'フォレストガンプ', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [619, 416, 417, 410, 117] },
                { id: 408, name: 'もののけ姫', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Mix, answers: [516, 104, 507, 207, 609, 607] },
                { id: 409, name: 'フェラーリ', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [516, 208, 110, 418, 511] },
                { id: 410, name: 'モスクワ', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [205, 415, 110, 111, 107, 516] },
                { id: 411, name: 'すき家', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Mix, answers: [419, 100, 601, 217, 417] },
                { id: 412, name: 'オレオ', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [107, 203, 619, 610, 317, 212] },
                { id: 413, name: 'ニコニコ動画', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Mix, answers: [105, 210, 107, 514, 609, 604] },
                { id: 414, name: '花王', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Kanji, answers: [215, 604, 607, 207, 218, 115, 613, 612, 403] },
                { id: 415, name: 'キングコング', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [603, 116, 517, 208, 615] },
                { id: 416, name: 'オニール', category: CQ.Album.Category.Sports, type: CQ.Album.AnswerType.Katakana, answers: [400, 113, 511, 210, 100] },
                { id: 417, name: 'リオデジャネイロ', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [311, 110, 203, 100, 416] },
                { id: 418, name: 'デビッドベッカム', category: CQ.Album.Category.Sports, type: CQ.Album.AnswerType.Katakana, answers: [511, 509, 512, 311, 309] },
                { id: 419, name: '羊たちの沈黙', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Kanji, answers: [219, 101, 614, 414, 218, 611] }
            ]
        },
        {
            level: 5,
            name: 'ステージ５',
            pictures: [
                { id: 500, name: '鉄腕アトム', category: CQ.Album.Category.Cartoon, type: CQ.Album.AnswerType.Mix, answers: [415, 613, 514, 502, 101, 317] },
                { id: 501, name: 'ナルト', category: CQ.Album.Category.Animation, type: CQ.Album.AnswerType.Katakana, answers: [113, 615, 619, 516, 412, 519, 618] },
                { id: 502, name: 'マラドーナ', category: CQ.Album.Category.Sports, type: CQ.Album.AnswerType.Katakana, answers: [410, 506, 114, 111, 113] },
                { id: 503, name: 'アングリーバード', category: CQ.Album.Category.Game, type: CQ.Album.AnswerType.Katakana, answers: [400, 409, 417] },
                { id: 504, name: 'サブウェイ', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [310, 315, 107, 116, 519] },
                { id: 505, name: 'スタートレック', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [506, 317, 509, 113, 603] },
                { id: 506, name: 'フレンズ', category: CQ.Album.Category.Series, type: CQ.Album.AnswerType.Katakana, answers: [505, 512, 404, 507] },
                { id: 507, name: 'アルゼンチン', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [417, 205, 504, 510] },
                { id: 508, name: 'シュレック', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [113, 601, 200, 415, 213] },
                { id: 509, name: 'イエス', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [316, 313, 300, 407] },
                { id: 510, name: 'グラディエーター', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [113, 517, 407, 412] },
                { id: 511, name: 'チリ', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [100, 504, 113, 116, 508, 110] },
                { id: 512, name: 'マダガスカル', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [112, 418, 212, 409, 213] },
                { id: 513, name: 'ドバイ', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [508, 602, 417, 205, 519, 317] },
                { id: 514, name: '豐臣秀吉', category: CQ.Album.Category.History, type: CQ.Album.AnswerType.Kanji, answers: [207, 607, 419, 115, 403, 614] },
                { id: 515, name: 'AMEBA', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.English, answers: [109, 406, 201, 214, 304] },
                { id: 516, name: 'プレスリー', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [512, 506, 618, 410, 511, 203] },
                { id: 517, name: 'ロールスロイス', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [516, 412, 217, 506, 418] },
                { id: 518, name: 'COCO壱番屋', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Mix, answers: [414, 305, 116, 101, 102] },
                { id: 519, name: 'ブッシュ', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [418, 105, 312, 600] }
            ]
        },
        {
            level: 6,
            name: 'ステージ６',
            pictures: [
                { id: 600, name: 'グリコ', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [312, 310, 602, 102, 619, 315] },
                { id: 601, name: 'クリントン', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [418, 312, 313, 113] },
                { id: 602, name: 'ロシア', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [412, 410, 110, 507, 202, 603] },
                { id: 603, name: 'ホーキング', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [313, 212, 618, 410, 513, 600] },
                { id: 604, name: '丸井', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Kanji, answers: [115, 612, 611, 219, 403, 414, 207, 216] },
                { id: 605, name: '英国王のスピーチ', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Mix, answers: [210, 611, 110, 100, 403] },
                { id: 606, name: 'アナと雪の女王', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Mix, answers: [207, 614, 609, 600, 513, 319] },
                { id: 607, name: '桜木花道', category: CQ.Album.Category.Animation, type: CQ.Album.AnswerType.Kanji, answers: [414, 219, 215, 101, 419, 611] },
                { id: 608, name: 'セーラームーン', category: CQ.Album.Category.Cartoon, type: CQ.Album.AnswerType.Katakana, answers: [400, 311, 310, 309] },
                { id: 609, name: '高知县', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Kanji, answers: [207, 514, 219, 414, 614, 604, 218] },
                { id: 610, name: 'プリングス', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [205, 519, 103, 512, 501, 104] },
                { id: 611, name: '三丁目の夕日', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Kanji, answers: [218, 215, 612, 609, 419, 216, 614, 115] },
                { id: 612, name: '告白', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Kanji, answers: [101, 115, 604, 216, 419, 613, 219, 207] },
                { id: 613, name: '関羽', category: CQ.Album.Category.History, type: CQ.Album.AnswerType.Kanji, answers: [614, 403, 611, 207, 219, 607] },
                { id: 614, name: '香川真司', category: CQ.Album.Category.Sports, type: CQ.Album.AnswerType.Kanji, answers: [215, 101, 115, 609, 611, 613, 514, 218] },
                { id: 615, name: 'ガリレオ', category: CQ.Album.Category.Series, type: CQ.Album.AnswerType.Katakana, answers: [315, 415, 202] },
                { id: 616, name: '広島東洋カープ', category: CQ.Album.Category.Sports, type: CQ.Album.AnswerType.Mix, answers: [107, 509, 314, 507, 614] },
                { id: 617, name: '白い恋人', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Mix, answers: [512, 508, 116, 300, 414, 103] },
                { id: 618, name: 'ゴジラ', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [404, 610, 113, 205, 114] },
                { id: 619, name: 'インド', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [310, 410, 315, 103, 309] }
            ]
        }
    ]
};

CQ.App.inherits(CQ.Album.Default, CQ.Album);
//CQ.App.register(CQ.Album.Default);