console.log(process.argv)
var a = 0;
for(i=2; i<process.argv.length; i++)
{
	a+= Number(process.argv[i])
}
console.log(a)