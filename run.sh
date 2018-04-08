#!/bin/bash
pandoc -s index.md -H html/meta.html -c css/site.css -B html/header.html -A html/footer.html -M date="`date "+%B %e, %Y, with <3 from Dartmouth"`" -o index.html