const path = require('path')
var csv = require('csv')
var parse = require('csv-parse')
var fs = require('fs')
var geoip = require('geoip-lite')
var stringify = require('csv-stringify')

var ipLookerUpper = (function () {
  function start () {
    if (!validateCLIInput) {
      process.exit()
    }
    console.log(__dirname + process.argv[3])
    var writeStream = fs.createWriteStream(path.join(__dirname, process.argv[3]))
    var readStream = fs.createReadStream(process.argv[2])

    var parser = parse({delimiter: ','}, function (err, data) {
      // console.log(data)
      stringify(data.map(data => {
        // console.log('hey', data)
        // console.log(geoip.lookup(data[4]))
        var transformed = data
        var geoInfo = geoip.lookup(data[4])
        if (geoInfo != null) {
          transformed = transformed.concat([geoInfo.city, geoInfo.region, geoInfo.country, geoInfo.ll[0], geoInfo.ll[1]])
        }
        return transformed
      // console.log(data)
      }), function (err, output) {
        console.log(output)
        writeStream.write(output)
      })
    })
    readStream.pipe(parser)
  // readStream.on('readable', data => {
  //   while(data = readStream.read()) {
  //     console.log(data)
  //   }
  // })
  }

  function validateCLIInput () {
    if (process.argv.length < 4) {
      console.log('please give the input file and output file')
      return false
    }
    return true
  }

  return {
    start: start
  }
})()

ipLookerUpper.start()
