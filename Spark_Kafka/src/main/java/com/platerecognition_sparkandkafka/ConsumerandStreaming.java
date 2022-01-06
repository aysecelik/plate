package com.platerecognition_sparkandkafka;


import lombok.SneakyThrows;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.sql.*;
import org.apache.spark.sql.streaming.OutputMode;
import org.apache.spark.sql.streaming.StreamingQuery;
import org.apache.spark.sql.streaming.StreamingQueryException;
import org.apache.spark.sql.types.DataTypes;
import org.apache.spark.sql.types.Metadata;
import org.apache.spark.sql.types.StructField;
import org.apache.spark.sql.types.StructType;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.List;

import static java.lang.Long.parseLong;


public class ConsumerandStreaming {
    public static Dataset<Row> zipWithIndex(Dataset<Row> df, String name) {
        JavaRDD<Row> rdd = df.javaRDD().zipWithIndex().map(t -> {
            Row r = t._1;
            Long index = t._2 + 1;
            ArrayList<Object> list = new ArrayList<>();
            scala.collection.Iterator<Object> iterator = r.toSeq().iterator();
            while(iterator.hasNext()) {
                Object value = iterator.next();
                assert value != null;
                list.add(value);
            }
            list.add(index);
            return RowFactory.create(list.toArray());
        });
        StructType newSchema = df.schema()
                .add(new StructField(name, DataTypes.LongType, true, Metadata.empty()));
        return df.sparkSession().createDataFrame(rdd, newSchema);
    }

    public static void main(String[] args) throws StreamingQueryException {
        System.setProperty("hadoop.home.dir","C:\\hadoop-common-2.2.0-bin-master");
        SparkConf sparkConf = new SparkConf().setMaster("local[*]").setAppName("plate_recognition");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
        SparkSession postgre = SparkSession.builder().getOrCreate();
        Dataset<Row> plate = postgre.read().format("jdbc")
                .option("url","jdbc:postgresql://localhost:5432/plate_recognition")
                .option("dbtable","plate")
                .option("user","postgres")
                .option("password","admin")
                .option("Driver","org.postgresql.Driver")
                .load();
        plate.show();
        Dataset<Row>  camera = postgre.read().format("jdbc")
                .option("url","jdbc:postgresql://localhost:5432/plate_recognition")
                .option("dbtable","kameralar")
                .option("user","postgres")
                .option("password","admin")
                .option("Driver","org.postgresql.Driver")
                .load();
        camera.show();
        List<Row> cameraloc = camera.select("Location")
                .collectAsList();

        SparkSession spark = SparkSession.builder().getOrCreate();
        Dataset<Row> df = spark.readStream().format("kafka")
                .option("kafka.bootstrap.servers", "localhost:9092")
                .option("subscribe", "plaka")
                .load();

        df=df.withColumn("key_str", df.col("key").cast("String").alias("key_str")).drop("key")
        .withColumn("value_str", df.col("value").cast("String").alias("key_str")).drop("value");
        Dataset<Row> indexplaka = zipWithIndex(plate, "index");
        indexplaka=indexplaka.withColumn("plaka_str", indexplaka.col("plaka").cast("String").alias("plaka_str")).drop("plaka");
        for(int i=1;i<= indexplaka.count();i++){
            List<Row> rows = indexplaka.filter(indexplaka.col("index").equalTo(i))
                    .select("plaka_str")
                    .collectAsList();
            Row row = rows.get(0);
            String plaka= row.getString(0);
            char a='"';
            plaka=a+plaka+a;
            System.out.println(plaka);
            //df=df.filter(df.col("value_str").equalTo(plaka));
            df=df.filter(df.col("value_str").notEqual(plaka));
        }
        df= df.select("key_str","value_str","timestamp");

        StreamingQuery console = df.writeStream().foreach(new ForeachWriter<Row>() {
                   Connection connection;
                   PreparedStatement statement;
            @SneakyThrows
            @Override
            public boolean open(long l, long l1) {
                Class.forName("org.postgresql.Driver");
                connection = DriverManager.getConnection("jdbc:postgresql://localhost:5432/plate_recognition", "postgres", "admin");
                connection.setAutoCommit(false);
                statement = connection.prepareStatement("insert into sahte_plakalar (product_plaka,kameraid,tarih,Location) values (?,?,?,?)");
                return true;
            }

            @SneakyThrows
            @Override
            public void process(Row row) {
                statement.setString(1,row.getString(1).replace("\"",""));
                statement.setLong(2,parseLong(row.getString(0)));
                statement.setTimestamp(3,row.getTimestamp(2) );
                System.out.println("row = " + parseLong(row.getString(0)));

                Long l= parseLong(row.getString(0));
                Row location = cameraloc.get(l.intValue()-1);
                System.out.println("row = " + location);
                System.out.println("args = " + location.getString(0));
                statement.setString(4, location.getString(0));
                statement.executeUpdate();
            }

            @SneakyThrows
            @Override
            public void close(Throwable throwable) {
                connection.commit();
                connection.close();

            }
        })
                .outputMode(OutputMode.Append()).start()
                ;

        console.awaitTermination();


    }

}
