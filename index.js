const fs = require("fs");
const WavDecoder = require("wav-decoder");
const WavEncoder = require("wav-encoder");

Array.prototype.insert = function(index) {
    index = Math.min(index, this.length);
    arguments.length > 1
        && this.splice.apply(this, [index, 0].concat([].pop.call(arguments)))
        && this.insert.apply(this, arguments);
    return this;
};

const FIRST_SOUND_LENGTH = 128988;
const SECOND_SOUND_LENGTH = 128988*2;
const THIRD_SOUND_LENGTH = 128988*3;

const readFile = (filepath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, (err, buffer) => {
      if (err) {
        return reject(err);
      }
      return resolve(buffer);
    });
  });
};

readFile("2dPassing.wav").then((buffer) => {
  return WavDecoder.decode(buffer);
}).then(function(audioData) {

  let leftChannel = Object.values(audioData.channelData[1]);
  let rightChannel = Object.values(audioData.channelData[0]);

  // leftChannel = move(leftChannel, FIRST_SOUND_LENGTH, 40);
  // rightChannel = move(rightChannel, SECOND_SOUND_LENGTH, 40);

  leftChannel = move(leftChannel, 0, 80);
  leftChannel = move(leftChannel, FIRST_SOUND_LENGTH, 60);
  leftChannel = move(leftChannel, FIRST_SOUND_LENGTH*2, 40);
  leftChannel = move(leftChannel, FIRST_SOUND_LENGTH*3, 20);

  rightChannel = move(rightChannel, FIRST_SOUND_LENGTH*5, 20);
  rightChannel = move(rightChannel, FIRST_SOUND_LENGTH*6, 40);
  rightChannel = move(rightChannel, FIRST_SOUND_LENGTH*7, 60);
  rightChannel = move(rightChannel, FIRST_SOUND_LENGTH*8, 80);


  audioData.channelData[0] = Float32Array.from(leftChannel)
  audioData.channelData[1] = Float32Array.from(rightChannel)

  WavEncoder.encode(audioData).then((buffer) => {
    fs.writeFileSync("2dPassing4.wav", new Buffer(buffer));
  });
});

function move(array, sound_length, amount) {
  for(i=sound_length; i<sound_length+amount; i++){
    array.insert(i,0);
  }
  if(sound_length == 0) sound_length = FIRST_SOUND_LENGTH;
  array.splice((2*sound_length)-amount, amount);
  return array;
}
