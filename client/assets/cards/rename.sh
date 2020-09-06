suit="♥"
for file in `ls *heart*`; do
  temp=${suit}`echo $file|cut -c1`
  mv $file ${temp^^}.png
done