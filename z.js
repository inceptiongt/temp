import { ref, computed, watch, onMounted } from 'vue'

function useMouse1() {
    const x = ref(0)
    const y = ref(0)
    const update = e => {
        x.value = e.pageX
        y.value = e.pageY
    }
    // 生命周期
    onMounted(() => {
        window.addEventListener('mousemove', update)
    })
    onUnmounted(() => {
        window.removeEventListener('mousemove', update)
    })
    return { x, y }
}

// in consuming component
const Component = {

    setup() {
        // 使用hooks
        const { x, y } = useMouse1()
        return { x, y }
    },
    template: `<div>{{ x }} {{ y }}</div>`
}

import { useState, useEffect } from 'react'

function useMouse2() {
    const [x, setX] = useState(0)
    const [y, setY] = useState(0)
    const update = e => {
        setX(e.pageX)
        setY(e.pageY)
    }
    // 生命周期
    useEffect(() => {
        window.addEventListener('mousemove', update)
    }, () => {
        window.removeEventListener('mousemove', update)
    })
    return { x, y }
}

function _component(params) {
    const {x, y} = useMouse2()
    return (<div>{{ x }} {{ y }}</div>)
}
