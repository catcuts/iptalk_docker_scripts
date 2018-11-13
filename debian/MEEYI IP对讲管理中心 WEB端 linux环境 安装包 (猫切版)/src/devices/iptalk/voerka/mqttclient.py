# -*- coding:utf-8 -*-
from twisted.internet.defer import inlineCallbacks
from twisted.application.internet import ClientService, backoffPolicy
from core.logger import log
from settings import Settings

BROKER = 'mqtt_broker' in Settings.get('voerka') and Settings.get('voerka')['mqtt_broker'] or None


class MQTTService(ClientService):
    topics = []

    def __init__(self, endpoint, factory, topics):
        self.topics = topics
        ClientService.__init__(self, endpoint, factory, retryPolicy=backoffPolicy())

    def startService(self):
        # log.info("starting MQTT Client Service")
        self.whenConnected().addCallback(self.connectToBroker)
        ClientService.startService(self)

    @inlineCallbacks
    def connectToBroker(self, protocol):
        """
        Connect to MQTT broker
        """
        self.protocol = protocol
        self.protocol.onPublish = self.onPublish
        self.protocol.onDisconnection = self.onDisconnection
        self.protocol.setWindowSize(3)
        try:
            yield self.protocol.connect(clientId=Settings.get('voerka')['clientId'], keepalive=60,
                                        username=Settings.get('voerka')['username'],
                                        password=Settings.get('voerka')['password'])
            yield self.subscribe(self.topics)  # 默认订阅主题
        except Exception as e:
            log.error("Connecting to {broker} raised {excp!s}", broker=BROKER, excp=e)

    def publish(self, topic, message):
        def _logFailure(failure):
            log.debug("publisher reported {message}", message=failure.getErrorMessage())
            return failure

        d1 = self.protocol.publish(topic=topic, qos=1, message=message)
        d1.addErrback(_logFailure)
        return d1

    def subscribe(self, topics):
        def _logFailure(failure):
            log.debug("subscriber reported {message}", message=failure.getErrorMessage())
            return failure

        def _logGrantedQoS(value):
            log.debug("subscriber response {value!r}", value=value)
            return True

        if type(topics) == list:
            for topic in topics:
                d1 = self.protocol.subscribe(topic, 2)
                d1.addCallbacks(_logGrantedQoS, _logFailure)
        else:
            d1 = self.protocol.subscribe(topics, 2)
            d1.addCallbacks(_logGrantedQoS, _logFailure)
        return d1

    def unsubscribe(self, topics):
        def _logFailure(failure):
            log.debug("subscriber reported {message}", message=failure.getErrorMessage())
            return failure

        def _logGrantedQoS(value):
            log.debug("subscriber response {value!r}", value=value)
            return True

        d1 = self.protocol.unsubscribe(topics)
        d1.addCallbacks(_logGrantedQoS, _logFailure)
        return d1

    def onPublish(self, topic, payload, qos, dup, retain, msgId):
        '''
        Callback Receiving messages from publisher
        '''
        MQTTMessage(self, topic, payload, qos, dup, retain, msgId)

    def onDisconnection(self, reason):
        """
        retry connection
        """
        self.whenConnected().addCallback(self.connectToBroker)


class MQTTMessage(object):
    client = None
    topic = None
    payload = None
    qos = None
    dup = None
    retain = None
    msgId = None

    def __init__(self, client, topic, payload, qos, dup, retain, msgId):
        self.client = client
        self.topic = topic
        self.payload = payload
        self.qos = qos
        self.dup = dup
        self.retain = retain
        self.msgId = msgId
        print topic
        print payload
