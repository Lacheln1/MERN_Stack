export const formmatCurrency = number=>{
    return number.toLocaleString()+'원'
}

export const formatDate = date=>{
    const d = new Date(date)
    const year = d.getFullYear()
    // getMonth는 0부터 시작하니까 1을 더하고 10보다 작으면 앞에 0추가함
    //padStart : 문자열의 길이를 지정한 만큼 늘리고 부족한 부분은 앞쪽에 원하는 문자를 추가해줌 
    // 날짜는 두자리수니까 2로 하고 1일부터 9일까지는 앞에 0을 추가함
    const month = String(d.getMonth()+1).padStart(2,'0')
    const day = String(d.getDate()).padStart(2,'0')

    return `${year}. ${month}. ${day}`
}

//디바운스 : 연속된 호출을 지연시켜 한번만 실행. 함수(함수,대기시간)
export const debounce = (func,delay=300)=>{
    let timerId
    return function(...args){
        if(timerId) clearTimeout(timerId)
        timerId = setTimeout(()=>{
    func.apply(this,args)
        },delay)
    }
}

//쓰로틀 : 일정 시간 동안 한번만 실행. 함수(함수, 대기시간)
export const throttle = (func,limit=300) =>{
    let inThrottle
    return function(...args){
        //일반 함수로 변경
        if(!inThrottle) {
            func.apply(this,args)
            inThrottle = true
            setTimeout(()=>(inThrottle=false),limit)
        }
    }
}