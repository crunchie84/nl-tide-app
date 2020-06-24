https://getij.rws.nl/ -> contains the list of places and codes in the HTML

```
<div class="right">
<h2>Jaar 2019:</h2>
<h3>XML documenten</h3>
<h4>Referentievlak = NAP<br>
Tijdzone = Nederlandse tijd (GMT +1), inclusief zomertijd correctie</h4>
<a href="data/xml/hwlw-AMLAHVN-Amaliahaven-20190101-20191231.xml">Amaliahaven </a> <br>
```

links to downloadable tide information are in the form of `{code}-{locationname}-{beginofyear}-{endofyear}.xml`
- `<h4>Referentievlak = NAP<br>` is needed to determine pointOfReference for the following items in the list
- `Tijdzone = Nederlandse tijd (GMT +1), inclusief zomertijd correctie</h4>` -> times are stored in GMT+1, we need to convert them to ISO format for easier interpretation

file to download -> https://getij.rws.nl/data/xml/hwlw-ROTTDM-Rotterdam-20200101-20201231.xml
