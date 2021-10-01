let ajaxLog = new Log4js.getLogger("ajaxTest");
ajaxLog.setLevel(Log4js.Level.ALL);
let ajaxAppender = new Log4js.AjaxAppender( "logging.log4js");
ajaxLog.addAppender(ajaxAppender);
// ajaxAppender.setThreshold(5);
ajaxAppender.setLayout(new Log4js.JSONLayout());


function ajaxTest(){
    let logger = Log4js.getLogger("testlogger");
    logger.setLevel(Log4js.Level.ALL);
    //logger.addAppender(new Log4js.ConsoleAppender(logger));
    logger.addAppender(new Log4js.AjaxAppender(""));

    for(let i = 0; i <5 ; i++) {
        logger.info('an info ' + i);
        logger.warn('a warning ' + i);
        logger.error('an error ' + i);
    }
}

setTimeout(()=>{
    // ajaxTest();
    ajaxLog.error('I was traced!');
},10000);
