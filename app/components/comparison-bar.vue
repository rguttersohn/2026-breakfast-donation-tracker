<script lang="ts" setup>

const store = useStore();

const barWidth = computed(()=>{

    const decimal = (store.total.value/store.goal)*100;

    if(decimal > 100){

        return '100%';

    }

    return `${decimal}%`;

})

</script>


<template>
    <div class="relative h-10 mb-15 w-full bg-primary-200 rounded-full">
        <div 
            class="absolute h-full left-0 top-0 bg-primary-900 rounded-full transition-[width] ease-in-out duration-1000" 
            :style="{
                width: barWidth
            }"
        ></div>
        <p class="absolute left-0 translate-y-10">
            <span>{{ store.total_percent }}</span> 
            of goal
        </p>
        <p class="absolute right-0 translate-y-10">
            <span>{{ store.goal_string }}</span> 
            goal
        </p>
    </div>
</template>