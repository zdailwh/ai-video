import axios from 'axios'

// const host = ''
export default {
  async getVideos () {
    var res = await axios.get()
    console.log(res)
    return res
  }
}
