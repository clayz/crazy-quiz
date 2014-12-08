CQ.Album = {
    TOTAL_ALBUM: 2,

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
        Geography: { id: 13, name: '地理' },
        Culture: { id: 14, name: '文化' },
        Music: { id: 15, name: '音楽' },
        Art: { id: 16, name: 'アート' },
        Product: { id: 17, name: '製品' }
    },

    init: function() {
    },

    getAlbum: function(id) {
        switch (id) {
            case CQ.Album.Default.id:
                return CQ.Album.Default;
            case CQ.Album.Second.id:
                return CQ.Album.Second;
            default:
                return null;
        }
    },

    isAlbumLocked: function(id) {
        return id > CQ.Datastore.Picture.getLastAlbumId();
    },

    unlockAlbum: function(albumId, isPurchase) {
        CQ.Log.debug('Unlock album {0}, is purchase: {1}'.format(albumId, isPurchase));
        var lastAlbumId = CQ.Datastore.Picture.getLastAlbumId();

        if (albumId > this.TOTAL_ALBUM) {
            CQ.Log.error('There is no such album to unlock: {0}'.format(albumId));
            return false;
        } else if (albumId != (lastAlbumId + 1)) {
            CQ.Log.error('Incorrect unlock album {0}, last album {1}'.format(albumId, lastAlbumId));
            return false;
        }

        if (!isPurchase || CQ.Currency.consume(CQ.Currency.Consume.UnlockAlbum, albumId)) {
            CQ.Datastore.Picture.setLastAlbumId(albumId);
            CQ.Datastore.Picture.setLastLevel(albumId, 1);
            CQ.Page.Main.refreshCurrency();
            CQ.Page.Main.enableAlbum(albumId);
            CQ.Page.Main.enableLevel(albumId, 1);

            if (isPurchase) CQ.GA.track(CQ.GA.Album.UnlockPurchase, CQ.GA.Album.UnlockPurchase.label.format(albumId));
            else CQ.GA.track(CQ.GA.Album.Unlock, CQ.GA.Album.Unlock.label.format(albumId));

            return true;
        } else return false;
    },

    getLevel: function(level) {
        return this.levels[level - 1];
    },

    unlockLevel: function(albumId, level, isPurchase) {
        CQ.Log.debug('Unlock album {0} level {1}, is purchase: {2}'.format(albumId, level, isPurchase));
        var lastLevel = CQ.Datastore.Picture.getLastLevel(albumId), album = CQ.Album.getAlbum(albumId);

        if (level > album.levels.length) {
            CQ.Log.error('There is no such level to unlock: {0}'.format(level));
            return false;
        } else if (level != (lastLevel + 1)) {
            CQ.Log.info('Incorrect unlock level {0}, last level {1}'.format(level, lastLevel));
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
            answerTexts = picture.textAnswers,
            remainingChars = length - picture.name.length,
            alternativeAnswers = [pictureId],
            alternativeTexts = [];

        if (answerTexts.length > 0) {
            // has text alternative answers defined
            for (var i = 0; (remainingChars > 0) && (answerTexts.length > i); i++) {
                var alternativeChars = answerTexts[i];

                if (remainingChars > alternativeChars.length) {
                    chars = chars.concat(alternativeChars.split(''));
                    alternativeTexts.push(alternativeChars);
                    remainingChars -= alternativeChars.length;
                } else if (remainingChars == alternativeChars.length) {
                    chars = chars.concat(alternativeChars.split(''));
                    alternativeTexts.push(alternativeChars);
                    break;
                } else {
                    chars = chars.concat(alternativeChars.split('').slice(0, remainingChars));
                    break;
                }
            }
        } else if (answerIds.length > 0) {
            // has id alternative answers defined
            for (var j = 0; (remainingChars > 0) && (answerIds.length > j); j++) {
                var alternativePictureId = answerIds[j],
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
        } else CQ.Log.error('Neither answer text nor answer id been defined.');

        return {
            chars: CQ.Album.shuffle(chars),
            alternativeAnswers: alternativeAnswers,
            alternativeTexts: alternativeTexts
        };
    },

    shuffle: function(arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    }
};

CQ.App.register(CQ.Album);