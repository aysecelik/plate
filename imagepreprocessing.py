import cv2
import numpy as np
from sklearn import preprocessing
import pytesseract
pytesseract.pytesseract.tesseract_cmd = 'C:\Program Files\\Tesseract-OCR\\tesseract.exe'


class imageprocessing:

    def preprocessing():
        net = cv2.dnn.readNet('yolov3_custom_last.weights', 'yolov3_custom.cfg')
        classes = []
        with open("classes.txt", "r") as f:
            classes = f.read().splitlines()

        cap = cv2.VideoCapture('plate/17.jpg')
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
                        img2.append(img[y:y+h,x:x+w])




            for i in range(len(img2)):
                cv2.imshow('plaka'+str(i), img2[i])
                txt=pytesseract.image_to_string(img2[i],config=f'--psm 8 --oem 3 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
                print(pytesseract.image_to_string(img2[i],config=f'--psm 8 --oem 3 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'))
            cv2.imshow('Image', img)

            if cv2.waitKey (1) & 0xFF == ord ('q'):
                break
            i=i+1
        return img2

    if __name__ == '__main__':
        preprocessing()
        cv2.waitKey(0)


