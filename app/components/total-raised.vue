<script lang="ts" setup>

const store = useStore();

</script>

<template>
    <div class="flex flex-col justify-start">
        <p>Total raised, including pledges:</p>
        <p 
            class="mb-10 leading-[10rem] text-[10rem] font-bold text-primary-900"
        >
            {{ store.total_string }}
        </p>
        <ComparisonBar/>
        <p 
            v-if="store.total.value < store.goal"
            class="font-bold">{{ store.goalDifference_string }} to go
        </p>
        <p v-else>
            Goal Reached!
        </p>
    </div>
</template>