const STATUS_USER = {
    ACTIVE : 1,
    LOCK : -1
}

const STATUS_CHANEL = {
    ACTIVE : 1,
    LOCK : -1
}

const ROLE_USER = {
    USER : 1,
    AGENT : 2,
    ADMIN : 3
}

const STATUS_GIFT = {
    ACTIVE : 1,
    LOCK : -1
}

const TYPE_GIFT = {
    MONEY : 1,
    PRODUCT : 2
}

const STATUS_QUESTION = {
    ACTIVE : 1,
    LOCK : -1
}

const STATUS_USER_REQUEST = {
    PENDING : 0,
    ACTIVED : 1,
    CANCEL : -1,
    SAVE : -2
}

const LIVESTREAM_TIME_ENUM = {
    K1 : {
        FROM : "09:00",
        TO : "10:00"
    },
    K2 : {
        FROM : "15:00",
        TO : "16:00"
    },
    K3 : {
        FROM : "20:00",
        TO : "21:00"
    }
}

module.exports = {
    STATUS_USER,
    STATUS_CHANEL,
    ROLE_USER,
    STATUS_GIFT,
    TYPE_GIFT,
    STATUS_QUESTION,
    LIVESTREAM_TIME_ENUM,
    STATUS_USER_REQUEST
}