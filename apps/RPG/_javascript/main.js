function getDistance() {
    let hypotenuse = document.getElementById('hypotenuse')
    let adjacent_cathetus = document.getElementById('adjacent_cathetus')
    let opposite_cathetus = document.getElementById('opposite_cathetus')
    let H = hypotenuse.value
    let ac = adjacent_cathetus.value
    let oc = opposite_cathetus.value

    if (!H && ac && oc) {
        H = Math.sqrt(Math.pow(ac, 2) + Math.pow(oc, 2))
        hypotenuse.value = H
    } else if (!ac && oc && H) {
        ac = Math.sqrt(Math.pow(H, 2) - Math.pow(oc, 2))
        adjacent_cathetus.value = ac
    } else if (!oc && ac && H) {
        oc = Math.sqrt(Math.pow(H, 2) - Math.pow(ac, 2))
        opposite_cathetus.value = oc
    }
}