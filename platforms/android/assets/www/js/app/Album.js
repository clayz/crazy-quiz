CQ.Album = {
    TOTAL_ALBUM: 1,

    Category: {
        Film: { id: 1, name: '映画' },
        Series: { id: 2, name: 'ドラマ' },
        Cartoon: { id: 3, name: '漫画' },
        Entertainer: { id: 4, name: '芸能人' },
        Brand: { id: 5, name: 'ブランド' },
        Celebrity: { id: 6, name: '有名人' }
    },

    getAlbum: function(id) {
        switch (id) {
            case CQ.Album.Default.id:
                return CQ.Album.Default;
            case CQ.Album.Test.id:
                return CQ.Album.Test;
            case CQ.Album.Test2.id:
                return CQ.Album.Test2;
            default:
                return null;
        }
    },

    isAlbumLocked: function(id) {
        return id > CQ.Datastore.getLastAlbumId();
    },

    unlockAlbum: function(albumId, isPurchase) {
        console.log('Unlock album {0}, is purchase: {1}'.format(albumId, isPurchase));
        var lastAlbumId = CQ.Datastore.getLastAlbumId();

        if (albumId > this.TOTAL_ALBUM) {
            console.info('There is no such album to unlock.');
            return false;
        } else if (albumId != (lastAlbumId + 1)) {
            console.error('Incorrect unlock album {0}, last album {1}'.format(albumId, lastAlbumId));
            return false;
        }

        if (!isPurchase || CQ.Currency.consume(CQ.Currency.Consume.UnlockAlbum, albumId)) {
            CQ.Datastore.setLastAlbumId(albumId);
            CQ.Page.Main.refreshCurrency();
            CQ.Page.Main.enableAlbum(albumId);
            return true;
        } else return false;
    },

    unlockLevel: function(albumId, level, isPurchase) {
        console.log('Unlock album {0} level {1}, is purchase: {2}'.format(albumId, level, isPurchase));
        var lastLevel = CQ.Datastore.getLastLevel(albumId), album = CQ.Album.getAlbum(albumId);

        if (level > album.levels) {
            console.info('There is no such level to unlock.');
            return false;
        } else if (level != (lastLevel + 1)) {
            console.error('Incorrect unlock level {0}, last level {1}'.format(level, lastLevel));
            return false;
        }

        if (!isPurchase || CQ.Currency.consume(CQ.Currency.Consume.UnlockLevel, albumId, level)) {
            CQ.Datastore.setLastLevel(albumId, level);
            CQ.Page.Main.refreshCurrency();
            CQ.Page.Main.enableLevel(albumId, level);
            return true;
        } else return false;
    },

    getPicture: function(id) {
        var levelAndIndex = this.getPictureLevelAndIndex(id);
        return this[levelAndIndex.level][levelAndIndex.index];
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
            level: 'level' + idString.charAt(0),
            index: parseInt(idString.substring(1, 3), 10)
        }
    },

    getFirstPicture: function(level) {
        return this['level' + level][0];
    },

    getNextPicture: function(id) {
        var levelAndIndex = this.getPictureLevelAndIndex(id);
        return levelAndIndex.index >= this[levelAndIndex.level].length ? null : this[levelAndIndex.level][levelAndIndex.index + 1];
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
                var randomIndex = Math.floor(Math.random() * this['level' + randomLevel].length);
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
    name: '初めてのチャレンジ',
    path: 'img/album/default/',
    levels: 6,
    active: true,

    level1: [
        { id: 100, name: 'エイリアン', category: CQ.Album.Category.Film, answers: [] },
        { id: 101, name: '羊たちの沈黙', category: CQ.Album.Category.Film, answers: [] },
        { id: 102, name: 'ビッグバンセオリ', category: CQ.Album.Category.Series, answers: [] },
        { id: 103, name: 'ブレイブハート', category: CQ.Album.Category.Film, answers: [] },
        { id: 104, name: 'ダヴィンチコード', category: CQ.Album.Category.Film, answers: [] },
        { id: 105, name: 'ドラゴンボール', category: CQ.Album.Category.Cartoon, answers: [] }
    ],

    level2: [
        { id: 200, name: 'ヒックとドラゴン', category: CQ.Album.Category.Film, answers: [] },
        { id: 201, name: 'アイスエイジ', category: CQ.Album.Category.Film, answers: [] },
        { id: 202, name: 'インセプション', category: CQ.Album.Category.Film, answers: [] },
        { id: 203, name: 'インデペンデンス', category: CQ.Album.Category.Film, answers: [] },
        { id: 204, name: 'ベストキッド', category: CQ.Album.Category.Film, answers: [] },
        { id: 205, name: 'キングコング', category: CQ.Album.Category.Film, answers: [] }
    ],

    level3: [
        { id: 300, name: 'マダガスカル', category: CQ.Album.Category.Film, answers: [] },
        { id: 301, name: 'ジュラシックパー', category: CQ.Album.Category.Film, answers: [] },
        { id: 302, name: 'ジョーズ', category: CQ.Album.Category.Film, answers: [] },
        { id: 303, name: 'ワーナーブラザー', category: CQ.Album.Category.Brand, answers: [] },
        { id: 304, name: '鉄腕アトム', category: CQ.Album.Category.Cartoon, answers: [] },
        { id: 305, name: 'フレンズ', category: CQ.Album.Category.Series, answers: [] }
    ],

    level4: [
        { id: 400, name: 'アインシュタイン', category: CQ.Album.Category.Celebrity, answers: [] },
        { id: 401, name: 'モダン石器時代', category: CQ.Album.Category.Film, answers: [] },
        { id: 402, name: 'グラディエーター', category: CQ.Album.Category.Film, answers: [] },
        { id: 403, name: 'ゴシップガール', category: CQ.Album.Category.Series, answers: [] },
        { id: 404, name: '機動戦士ガンダム', category: CQ.Album.Category.Cartoon, answers: [] }
    ],

    level5: [
        { id: 500, name: 'スマーフ', category: CQ.Album.Category.Cartoon, answers: [] },
        { id: 501, name: 'カンフーパンダ', category: CQ.Album.Category.Film, answers: [] },
        { id: 502, name: 'ライオンキング', category: CQ.Album.Category.Film, answers: [] },
        { id: 503, name: 'ロードオブザリン', category: CQ.Album.Category.Film, answers: [] },
        { id: 504, name: 'フェラーリ', category: CQ.Album.Category.Brand, answers: [] }
    ],

    level6: [
        { id: 600, name: 'ベッカム', category: CQ.Album.Category.Celebrity, answers: [] },
        { id: 601, name: 'アカデミー賞', category: CQ.Album.Category.Brand, answers: [] },
        { id: 602, name: '金正恩', category: CQ.Album.Category.Celebrity, answers: [] },
        { id: 603, name: '毛沢東', category: CQ.Album.Category.Celebrity, answers: [] },
        { id: 604, name: 'ブルー初めての空', category: CQ.Album.Category.Film, answers: [] }
    ]
};

CQ.App.inherits(CQ.Album.Default, CQ.Album);
