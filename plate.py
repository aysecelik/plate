import cv2
import keras
import numpy as np
from sklearn.preprocessing import OneHotEncoder
from keras.models import Model
from kafka import KafkaProducer
from json import  dumps


def preprocessing():
        net = cv2.dnn.readNet('yolov3_custom_last.weights', 'yolov3_custom.cfg')
        classes = []
        with open("classes.txt", "r") as f:
            classes = f.read().splitlines()

        cap = cv2.VideoCapture('45.jpg')
        font = cv2.FONT_HERSHEY_PLAIN
        colors = np.random.uniform(0, 255, size=(100, 3))
        i=0
        while i<1:
            _, img = cap.read()
        
            height, width, _ = img.shape

            blob = cv2.dnn.blobFromImage(img, 1/255, (416, 416), (0,0,0), swapRB=True, crop=False)
            net.setInput(blob)
            output_layers_names = net.getUnconnectedOutLayersNames()
            layerOutputs = net.forward(output_layers_names)

            boxes = []
            confidences = []
            class_ids = []

            for output in layerOutputs:
                for detection in output:
                    scores = detection[5:]
                    class_id = np.argmax(scores)
                    confidence = scores[class_id]
                    if confidence > 0.5:
                        center_x = int(detection[0]*width)
                        center_y = int(detection[1]*height)
                        w = int(detection[2]*width)
                        h = int(detection[3]*height)

                        x = int(center_x - w/2)
                        y = int(center_y - h/2)

                        boxes.append([x, y, w, h])
                        confidences.append((float(confidence)))
                        class_ids.append(class_id)

            indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.2, 0.4)
            img2=[]
            if len(indexes)>0:
                for i in indexes.flatten():
                    x, y, w, h = boxes[i]
                    label = str(classes[class_ids[i]])
                    confidence = str(round(confidences[i],2))
                    color = colors[i]
                    #cv2.putText(img, label + " " + confidence, (x, y+20), font, 2, (255,255,0), 1)
                    if(class_ids[i]==0):              
                        gray = cv2.cvtColor (img, cv2.COLOR_BGR2GRAY)
                        img2.append(img[y:y+h+2,x:x+w+2])




            for i in range(len(img2)):
                cv2.imshow('plaka'+str(i), img2[i])
                        
                        
            cv2.imshow('Image', img)

            if cv2.waitKey (1) & 0xFF == ord ('q'):
                break
            i=i+1
        return img2
def load_model():
    try:
        model=keras.models.load_model('model.json')
        model.load_weights('wpod-net.h5')
        print("Loading model successfully...")
        return model
    except Exception as e:
        print(e)

if __name__ == "__main__": 
    model= load_model()
    categories = np.array(list("ABCDEFGHIJKLMNOPRSTUVYZ0123456789"))
    onehot_enc = OneHotEncoder(sparse=False)
    onehot_enc.fit(categories.reshape(-1, 1))
    cap = cv2.VideoCapture('plate/1.jpg')
    preprocessing()
    _, img = cap.read()  
    prediction = model.predict(img)
    cv2.imshow(prediction)
    for ch in prediction:
        print(onehot_enc.inverse_transform(ch)[0][0], end="")
    b=[]
    for cg in prediction:
        a=onehot_enc.inverse_transform(cg)[0][0]
        b.append(onehot_enc.inverse_transform(cg)[0][0])
    print(a)
    print(b)
    print(b[0]+b[1]+b[2]+b[3]+b[4]+b[5]+b[6])
    tahmin=b[0]+b[1]+b[2]+b[3]+b[4]+b[5]+b[6]
    print(tahmin)
    producer = KafkaProducer(bootstrap_servers=['localhost:9092'],
                         value_serializer=lambda x: 
                         dumps(x).encode('utf-8'))
    producer.send('plaka',tahmin,key=str.encode('1'))
    producer.send("plaka",tahmin,key=str.encode('1'))
    
    producer.send("plaka","01A2805",key=str.encode('1'))
    producer.send("plaka","01A2807",key=str.encode('1'))





    
