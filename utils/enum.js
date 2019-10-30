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
    LOCK : -1,
    DELETE : 0
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
    SAVE : -2,
    PLAYED : 2
}

const LIVESTREAM_TIME_ENUM = [
    {
        id : 1,
        from : "07:00",
        to : "11:59",
        price : 10000000 //10.000.000 VNĐ 
    },
    {
        id : 2,
        from : "12:00",
        to : "18:00",
        price : 20000000 //20.000.000 VNĐ
    },
    {
        id : 3,
        from : "19:00",
        to : "23:59",
        price : 50000000 //50.000.000 VNĐ
    }
]

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