#!/usr/bin/env python3
import urllib.request
import os
import time

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "images", "cinema")

movies = {
    "mickey-17": "https://image.tmdb.org/t/p/original/7Oh1xRB8QbMduhqXEUHKlnwxMJi.jpg",
    "juno": "https://image.tmdb.org/t/p/original/6Jgs2esh9jSjjydFd9eVddGGkbm.jpg",
    "girl-interrupted": "https://image.tmdb.org/t/p/original/vmLrs4Efb1J7ojUtQS8eTgZ9UB5.jpg",
    "the-departed": "https://image.tmdb.org/t/p/original/hXc9wSsrRUM7d72ztZUVe48yJMt.jpg",
    "sing-street": "https://image.tmdb.org/t/p/original/d3k1raMFC3yRc1fdRXq5osH5L0f.jpg",
    "titanic": "https://image.tmdb.org/t/p/original/sDH1LkdFOkQmTJaF1sIIniQyFOk.jpg",
    "seven-years-in-tibet": "https://image.tmdb.org/t/p/original/vtB1vBFPgfDe1drzQTQdre3lapr.jpg",
    "500-days-of-summer": "https://image.tmdb.org/t/p/original/fxdhVDuOexOlcqZkHTpxA4e637y.jpg",
    "what-s-eating-gilbert-grape": "https://image.tmdb.org/t/p/original/n5DURAbVxUUFpMyez7pdCYYKMjr.jpg",
    "the-revenant": "https://image.tmdb.org/t/p/original/eZ8PPRynbCejUXaEt19t8DiohFU.jpg",
    "eternal-shine-of-a-spotless-mind": "https://image.tmdb.org/t/p/original/j6rZkE9ksbMsRhBvk9Az5uBc8LT.jpg",
    "forrest-gump": "https://image.tmdb.org/t/p/original/8XxkLzA1bEzFyiJCSV34q84jEjB.jpg",
    "the-godfather": "https://image.tmdb.org/t/p/original/mHfVamFzMrPvmudLpQMQbfxX6RL.jpg",
    "the-40-year-old-virgin": "https://image.tmdb.org/t/p/original/1Way1vGQz2B64r93Ube4Rsj955H.jpg",
    "john-wick-chapter-2": "https://image.tmdb.org/t/p/original/yHPQTXwWM91rJMPLTVb2jhOCRhp.jpg",
    "fight-club": "https://image.tmdb.org/t/p/original/jf7YOLnKwWReso5AwT5WSZAYavF.jpg",
    "once-upon-a-time-in-hollywood": "https://image.tmdb.org/t/p/original/ltUKAxoQ4GRu7EaUNg8GxD9vZ6u.jpg",
    "batman-begins": "https://image.tmdb.org/t/p/original/chvF1TjkC92TFADlG6y71F7xusJ.jpg",
    "american-psycho": "https://image.tmdb.org/t/p/original/9SZCbF3OzmoUZsNtRyn6BsNbwv5.jpg",
    "the-intern": "https://image.tmdb.org/t/p/original/vukP0Dlib9i09wrlAOHcCP0hXHd.jpg",
    "jumanji-welcome-to-the-jungle": "https://image.tmdb.org/t/p/original/8rpt5eFTRo2aslvJEiwZNzxV0Rr.jpg",
    "nick-and-norah-s-infinite-playlist": "https://image.tmdb.org/t/p/original/7qTrt4CZsSb8LJuI3SfOoFwghbA.jpg",
    "dodgeball-a-true-underdog-story": "https://image.tmdb.org/t/p/original/ovFwkB5aHIKL5ERBJZmm8jiAeX2.jpg",
    "you-don-t-mess-with-the-zohan": "https://image.tmdb.org/t/p/original/xTMIHrVHKFPljTyfq9m3H7SPLUy.jpg",
    "i-now-pronounce-you-chuck-larry": "https://image.tmdb.org/t/p/original/5VTFP2gYenwsRBW6ycn3eiZbudD.jpg",
    "murder-mystery": "https://image.tmdb.org/t/p/original/2WOw06TQn8tdSzbar3j03dXOdm6.jpg",
    "blended": "https://image.tmdb.org/t/p/original/jer02QqmnjlNgAxEiaISMW5rPtc.jpg",
    "submarine": "https://image.tmdb.org/t/p/original/1XJdsiWpDUbewo4sgN4n2AcZ95f.jpg",
    "the-revised-fundamentals-of-caregiving": "https://image.tmdb.org/t/p/original/pLInfXhADKkjJeMYuJLIwBw0TRo.jpg",
    "clueless": "https://image.tmdb.org/t/p/original/fQzZsWPkF9lhnPOHdJmJWpEIcO8.jpg",
    "the-king": "https://image.tmdb.org/t/p/original/t0Aw4vb63viYwIigBpQfGkYZtLU.jpg",
    "hot-summer-nights": "https://image.tmdb.org/t/p/original/yVxfB2kLu0JDBGSL5GsboZDOU5v.jpg",
    "se7en": "https://image.tmdb.org/t/p/original/ejcYNEKc0C59dqNBH9CtJ0WXNd1.jpg",
    "trainwreck": "https://image.tmdb.org/t/p/original/8NdTCM3248ZcgYkWEhtrBRTPdE.jpg",
    "the-da-vinci-code": "https://image.tmdb.org/t/p/original/uPCsQFPQUvSnagumudyvmmiCNv7.jpg",
    "20th-century-women": "https://image.tmdb.org/t/p/original/cIC5PtzQm276G32YpLfqUeSHkrE.jpg",
    "all-the-bright-places": "https://image.tmdb.org/t/p/original/wVzvmLSSI2NPD1Ya9ePAStLqBFB.jpg",
    "paper-towns": "https://image.tmdb.org/t/p/original/j2LJCbVXPOFr71oHV9izq2OBSyg.jpg",
    "the-fault-in-our-stars": "https://image.tmdb.org/t/p/original/wZrhokNJbZADb7Bnz3J9BynVtLL.jpg",
    "pawn-sacrifice": "https://image.tmdb.org/t/p/original/iE7w0DApmAKsnOh1jxgrMUElImY.jpg",
    "bridge-of-terabithia": "https://image.tmdb.org/t/p/original/gk8YZclwbHuKMoTFuQ773ECkHP9.jpg",
    "godfellas": "https://image.tmdb.org/t/p/original/eJjD49oSH9eCCEihGkID0M5E7Tf.jpg",
}

for slug, url in movies.items():
    filepath = os.path.join(OUT_DIR, f"{slug}.jpg")
    try:
        urllib.request.urlretrieve(url, filepath)
        print(f"OK: {slug}")
    except Exception as e:
        print(f"ERROR: {slug} — {e}")
    time.sleep(0.1)

print("Done!")
