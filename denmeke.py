from json import  dumps
from kafka import KafkaProducer
producer = KafkaProducer(bootstrap_servers=['localhost:9092'],
                         value_serializer=lambda x: 
                         dumps(x).encode('utf-8'))
producer.send("plaka",'01A2808',key=str.encode('1'))
producer.send("plaka",value="01A2805",key=str.encode('1'))
producer.send("plaka",value="01A2807",key=str.encode('1'))