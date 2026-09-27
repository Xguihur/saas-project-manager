<template>
  <el-container class="app-shell">
    <el-aside width="232px" class="app-sidebar">
      <div class="brand">SaaS Project Manager</div>
      <div class="workspace-label">当前工作区</div>
      <el-menu default-active="/" router>
        <el-menu-item index="/">项目概览</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="app-header">
        <div>
          <span class="eyebrow">PHASE 0</span>
          <h1>项目准备与骨架</h1>
        </div>
        <el-tag type="success" effect="light">开发环境</el-tag>
      </el-header>
      <el-main class="app-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
