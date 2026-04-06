<template>
  <div class="panel h-full flex flex-col">
    <div class="panel-title">
      ESTADO TRIPULACIÓN
      <span class="ml-auto mono text-[9px] text-slate-600">4 CREW · NOMINAL</span>
    </div>
    <div class="flex-1 p-3 flex flex-col gap-2">

      <!-- 2x2 crew grid -->
      <div class="grid grid-cols-2 gap-2 flex-1">
        <div
          v-for="c in crew"
          :key="c.name"
          class="border border-slate-700/30 rounded bg-slate-900/50 p-2.5 flex flex-col gap-1.5"
        >
          <!-- Name + agency -->
          <div>
            <div class="mono font-black text-sm tracking-widest uppercase"
              :style="{ color: c.color }">{{ c.lastName }}</div>
            <div class="mono text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-0.5"
              :style="{ color: c.roleColor }">{{ c.role }}</div>
            <div class="text-[8px] mono text-slate-700 uppercase tracking-widest">{{ c.agency }}</div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-1 mt-auto">
            <button class="mono text-[9px] px-2 py-0.5 rounded border flex-1"
              style="background: rgba(0,255,136,0.08); border-color: rgba(0,255,136,0.3); color: #00ff88">
              ✓ OK
            </button>
            <button class="mono text-[9px] px-2 py-0.5 rounded border flex-1"
              style="background: rgba(167,139,250,0.06); border-color: rgba(167,139,250,0.2); color: rgba(167,139,250,0.6)">
              SUT OK
            </button>
          </div>
        </div>
      </div>

      <!-- Historical firsts -->
      <div class="border-t border-white/5 pt-2">
        <div class="text-[9px] text-slate-600 mono uppercase tracking-widest mb-1.5">PRIMERA VEZ EN LUGAR</div>
        <div class="space-y-1">
          <div class="text-[10px] text-slate-500 leading-snug">
            <span style="color:#c4b5fd" class="mono font-bold">V. Glover</span>
            — 1er afroamericano más allá de LEO
          </div>
          <div class="text-[10px] text-slate-500 leading-snug">
            <span style="color:#ff88cc" class="mono font-bold">C. Koch</span>
            — 1ª mujer en vuelo lunar
          </div>
          <div class="text-[10px] text-slate-500 leading-snug">
            <span style="color:#88ffcc" class="mono font-bold">J. Hansen</span>
            — 1er no-estadounidense en luna
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const crew = [
  {
    name: 'Reid Wiseman',     lastName: 'WISEMAN',
    role: 'COMMANDER',        roleColor: '#a78bfa',
    agency: 'NASA',           color: '#a78bfa',
  },
  {
    name: 'Victor Glover',    lastName: 'GLOVER',
    role: 'PILOT',            roleColor: '#c4b5fd',
    agency: 'NASA',           color: '#c4b5fd',
  },
  {
    name: 'Christina Koch',   lastName: 'KOCH',
    role: 'MSN SPEC',         roleColor: '#ff88cc',
    agency: 'NASA',           color: '#ff88cc',
  },
  {
    name: 'Jeremy Hansen',    lastName: 'HANSEN',
    role: 'MSN SPEC',         roleColor: '#88ffcc',
    agency: 'CSA',            color: '#88ffcc',
  },
]
</script>
