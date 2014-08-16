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
        Country: { id: 8, name: '国家' },
        City: { id: 9, name: '都市' }
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
                var randomLevel = Math.floor(Math.random() * 6) + 1;
                var randomIndex = Math.floor(Math.random() * this.levels[randomLevel - 1].pictures.length);
                var randomId = this.getPictureId(randomLevel, randomIndex);

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
                { id: 100, name: 'スターバックス', category: CQ.Album.Category.Brand, answers: [] },
                { id: 101, name: 'LV', category: CQ.Album.Category.Brand, answers: [] },
                { id: 102, name: 'アイスエイジ', category: CQ.Album.Category.Film, answers: [] },
                { id: 103, name: 'オバマ', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 104, name: 'adidas', category: CQ.Album.Category.Brand, answers: [] },
                { id: 105, name: 'ちびまる子ちゃん', category: CQ.Album.Category.Cartoon, answers: [] },
                { id: 106, name: 'アングリーバード', category: CQ.Album.Category.Game, answers: [] },
                { id: 107, name: 'キャデラック', category: CQ.Album.Category.Brand, answers: [] },
                { id: 108, name: 'ナルト', category: CQ.Album.Category.Series, answers: [] },
                { id: 109, name: '英国王のスピーチ', category: CQ.Album.Category.Film, answers: [] },
                { id: 110, name: 'プレスリー', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 111, name: 'アルゼンチン', category: CQ.Album.Category.Country, answers: [] },
                { id: 112, name: 'アバター', category: CQ.Album.Category.Film, answers: [] },
                { id: 113, name: 'インド', category: CQ.Album.Category.Country, answers: [] },
                { id: 114, name: 'Facebook', category: CQ.Album.Category.Brand, answers: [] },
                { id: 115, name: '鉄腕アトム', category: CQ.Album.Category.Cartoon, answers: [] },
                { id: 116, name: 'オレオ', category: CQ.Album.Category.Brand, answers: [] },
                { id: 117, name: '忍者タートルズ', category: CQ.Album.Category.Cartoon, answers: [] },
                { id: 118, name: 'マラドーナ', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 119, name: 'サウスパーク', category: CQ.Album.Category.Cartoon, answers: [] }
            ]
        },
        {
            level: 2,
            name: 'ステージ２',
            pictures: [
                { id: 200, name: 'ワンピース', category: CQ.Album.Category.Series, answers: [] },
                { id: 201, name: 'シュレック', category: CQ.Album.Category.Film, answers: [] },
                { id: 202, name: 'ハーゲンダッツ', category: CQ.Album.Category.Brand, answers: [] },
                { id: 203, name: 'シャネル', category: CQ.Album.Category.Brand, answers: [] },
                { id: 204, name: 'Sony', category: CQ.Album.Category.Brand, answers: [] },
                { id: 205, name: 'ロナウド', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 206, name: 'アマゾン', category: CQ.Album.Category.Brand, answers: [] },
                { id: 207, name: 'ブラジル', category: CQ.Album.Category.Country, answers: [] },
                { id: 208, name: 'アイアンマン', category: CQ.Album.Category.Film, answers: [] },
                { id: 209, name: 'ソニック', category: CQ.Album.Category.Game, answers: [] },
                { id: 210, name: 'トロイ', category: CQ.Album.Category.Film, answers: [] },
                { id: 211, name: 'ジョーダン', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 212, name: 'ロールスロイス', category: CQ.Album.Category.Brand, answers: [] },
                { id: 213, name: 'マクドナルド', category: CQ.Album.Category.Brand, answers: [] },
                { id: 214, name: 'バルセロナ', category: CQ.Album.Category.City, answers: [] },
                { id: 215, name: 'タイタニック', category: CQ.Album.Category.Film, answers: [] },
                { id: 216, name: 'フェラーリ', category: CQ.Album.Category.Brand, answers: [] },
                { id: 217, name: 'オニール', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 218, name: 'サブウェイ', category: CQ.Album.Category.Brand, answers: [] },
                { id: 219, name: 'BMW', category: CQ.Album.Category.Brand, answers: [] }
            ]
        },
        {
            level: 3,
            name: 'ステージ３',
            pictures: [
                { id: 300, name: 'アメリ', category: CQ.Album.Category.Film, answers: [] },
                { id: 301, name: 'マリーキュリー', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 302, name: 'アインシュタイン', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 303, name: 'アンダーワールド', category: CQ.Album.Category.Film, answers: [] },
                { id: 304, name: 'デビッドベッカム', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 305, name: 'ジョブズ', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 306, name: 'クリントン', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 307, name: 'ジャクソン', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 308, name: 'スタートレック', category: CQ.Album.Category.Film, answers: [] },
                { id: 309, name: 'ブッシュ', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 310, name: '桜木花道', category: CQ.Album.Category.Cartoon, answers: [] },
                { id: 311, name: '呪われた海賊たち', category: CQ.Album.Category.Film, answers: [] },
                { id: 312, name: 'Yahoo', category: CQ.Album.Category.Brand, answers: [] },
                { id: 313, name: 'Lost', category: CQ.Album.Category.Series, answers: [] },
                { id: 314, name: 'インセプション', category: CQ.Album.Category.Film, answers: [] },
                { id: 315, name: 'イエス', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 316, name: 'スーパーマリオ', category: CQ.Album.Category.Game, answers: [] },
                { id: 317, name: '千と千尋の神隠し', category: CQ.Album.Category.Film, answers: [] },
                { id: 318, name: 'キングコング', category: CQ.Album.Category.Film, answers: [] },
                { id: 319, name: 'グラディエーター', category: CQ.Album.Category.Film, answers: [] }
            ]
        },
        {
            level: 4,
            name: 'ステージ４',
            pictures: [
                { id: 400, name: 'チリ', category: CQ.Album.Category.Country, answers: [] },
                { id: 401, name: 'ビルゲイツ', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 402, name: 'ロレックス', category: CQ.Album.Category.Brand, answers: [] },
                { id: 403, name: 'ヴェネツィア', category: CQ.Album.Category.City, answers: [] },
                { id: 404, name: 'リンカーン', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 405, name: 'ワシントン', category: CQ.Album.Category.City, answers: [] },
                { id: 406, name: '羊たちの沈黙', category: CQ.Album.Category.Film, answers: [] },
                { id: 407, name: 'ロンドン', category: CQ.Album.Category.City, answers: [] },
                { id: 408, name: 'フレンズ', category: CQ.Album.Category.Series, answers: [] },
                { id: 409, name: 'ロシア', category: CQ.Album.Category.Country, answers: [] },
                { id: 410, name: 'ホーキング', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 411, name: 'ドバイ', category: CQ.Album.Category.City, answers: [] },
                { id: 412, name: 'マダガスカル', category: CQ.Album.Category.Film, answers: [] },
                { id: 413, name: 'モスクワ', category: CQ.Album.Category.City, answers: [] },
                { id: 414, name: '貞子', category: CQ.Album.Category.Film, answers: [] },
                { id: 415, name: 'シドニー', category: CQ.Album.Category.City, answers: [] },
                { id: 416, name: 'ローマ', category: CQ.Album.Category.City, answers: [] },
                { id: 417, name: 'ガンダム', category: CQ.Album.Category.Game, answers: [] },
                { id: 418, name: 'リオデジャネイロ', category: CQ.Album.Category.City, answers: [] },
                { id: 419, name: 'フォレストガンプ', category: CQ.Album.Category.Film, answers: [] }
            ]
        },
        {
            level: 5,
            name: 'ステージ５',
            pictures: [
                { id: 500, name: 'スマーフ', category: CQ.Album.Category.Cartoon, answers: [] },
                { id: 501, name: 'カンフーパンダ', category: CQ.Album.Category.Film, answers: [] },
                { id: 502, name: 'ライオンキング', category: CQ.Album.Category.Film, answers: [] },
                { id: 503, name: 'ロードオブザリン', category: CQ.Album.Category.Film, answers: [] },
                { id: 504, name: 'フェラーリ', category: CQ.Album.Category.Brand, answers: [] }
            ]
        },
        {
            level: 6,
            name: 'ステージ６',
            pictures: [
                { id: 600, name: 'ベッカム', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 601, name: 'アカデミー賞', category: CQ.Album.Category.Brand, answers: [] },
                { id: 602, name: '金正恩', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 603, name: '毛沢東', category: CQ.Album.Category.Celebrity, answers: [] },
                { id: 604, name: 'ブルー初めての空', category: CQ.Album.Category.Film, answers: [] }
            ]
        }
    ]
};

CQ.App.inherits(CQ.Album.Default, CQ.Album);
