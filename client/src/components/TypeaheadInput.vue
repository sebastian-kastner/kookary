<!-- eslint-disable vue/no-v-html -->
<!-- 
    Code taken from: https://github.com/frikinside/vue3-simple-typeahead 
-->
<template>
  <div :id="wrapperId" class="simple-typeahead">
    <input
      :id="inputId"
      v-model="input"
      class="form-control simple-typeahead-input"
      type="text"
      :placeholder="placeholder"
      autocomplete="off"
      @input="onInput"
      @compositionupdate="onCompositionUpdate($event)"
      @compositionstart="onCompositionStart()"
      @compositionend="onCompositionEnd()"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.down.prevent="onArrowDown"
      @keydown.up.prevent="onArrowUp"
      @keydown.enter.tab.prevent="selectCurrentSelection"
    />
    <div v-if="isListVisible" class="simple-typeahead-list">
      <div v-if="$slots['list-header']" class="simple-typeahead-list-header">
        <slot name="list-header" />
      </div>

      <div
        v-if="addNewHandler !== undefined"
        class="simple-typeahead-list-item"
        :class="{
          'simple-typeahead-list-item-active': currentSelectionIndex == -1,
        }"
        @mousedown.prevent
        @click="selectItem"
        @mouseenter="currentSelectionIndex = -1"
      >
        <span class="simple-typeahead-list-item-text" :data-text="input">
          <Icon icon="plusCircle" />
          {{ input }}
        </span>
      </div>

      <div
        v-for="(item, index) in filteredItems"
        :key="index"
        class="simple-typeahead-list-item"
        :class="{
          'simple-typeahead-list-item-active': currentSelectionIndex == index,
        }"
        @mousedown.prevent
        @click="selectItem(item)"
        @mouseenter="currentSelectionIndex = index"
      >
        <span
          v-if="$slots['list-item-text']"
          class="simple-typeahead-list-item-text"
          :data-text="itemProjection(item)"
        >
          <slot
            name="list-item-text"
            :item="item"
            :item-projection="itemProjection"
            :bold-match-text="boldMatchText"
          />
        </span>
        <span
          v-else
          class="simple-typeahead-list-item-text"
          :data-text="itemProjection(item)"
          v-html="boldMatchText(itemProjection(item))"
        />
      </div>
      <div v-if="$slots['list-footer']" class="simple-typeahead-list-footer">
        <slot name="list-footer" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-facing-decorator";
import { Icon } from "@iconify/vue/dist/offline";

@Component({ components: { Icon } })
export default class TypeaheadInput extends Vue {
  @Prop({ required: false })
  id!: string;

  @Prop({ required: false, default: 1 })
  minInputLength!: number;

  @Prop({ required: true })
  items!: object[];

  @Prop({ required: false })
  excludedItems?: object[];

  @Prop({ required: false, default: "" })
  placeholder!: string;

  @Prop({
    required: false,
    default: (item: unknown) => {
      return item;
    },
  })
  itemProjection!: (item: unknown) => string;

  @Prop({ required: false, default: undefined })
  addNewHandler?: (name: string) => Promise<void>;

  @Prop({ required: false, default: false })
  resetOnSelect!: boolean;

  input = "";
  inputBeforeComposition = "";
  isInputFocused = false;
  currentSelectionIndex = 0;
  minSelectionIndex = 0;

  mounted(): void {
    if (this.addNewHandler !== undefined) {
      this.minSelectionIndex = -1;
      this.currentSelectionIndex = -1;
    }
  }

  get inputId(): string {
    if (!this.id) {
      return (Math.random() * 1000).toFixed();
    }
    return this.id;
  }

  get wrapperId(): string {
    return `${this.inputId}_wrapper`;
  }

  get filteredItems(): unknown[] {
    const regexp = new RegExp(this.escapeRegExp(this.input), "i");

    const excludedItemNames = new Set();
    if (this.excludedItems) {
      this.excludedItems.forEach((excludedItem) => {
        excludedItemNames.add(this.itemProjection(excludedItem));
      });
    }

    const filtered = this.items.filter(
      (item) =>
        this.itemProjection(item).match(regexp) &&
        !excludedItemNames.has(this.itemProjection(item))
    );
    return filtered;
  }

  get isListVisible() {
    return (
      this.isInputFocused &&
      this.input.length >= this.minInputLength &&
      (this.filteredItems.length || this.addNewHandler !== undefined)
    );
  }

  onInput() {
    if (
      this.isListVisible &&
      this.currentSelectionIndex >= this.filteredItems.length
    ) {
      this.currentSelectionIndex = (this.filteredItems.length || 1) - 1;
    }
    this.$emit("onInput", { input: this.input, items: this.filteredItems });
  }

  onCompositionStart(): void {
    this.inputBeforeComposition = this.input;
  }

  // this is a workaround to make the typeahead work on android in composition mode
  // when in composition mode, @input only fires when pressing space or when
  // choosing one of the android keyboard's suggested values
  // this workaround listens to composition updates and imitates a regular input event
  onCompositionUpdate(event: CompositionEvent) {
    if (event.data && this.input !== event.data) {
      this.input = this.inputBeforeComposition + event.data;
      this.onInput();
    }
  }

  onCompositionEnd(): void {
    this.inputBeforeComposition = "";
  }

  onFocus() {
    this.isInputFocused = true;
    this.$emit("onFocus", { input: this.input, items: this.filteredItems });
  }

  onBlur() {
    this.isInputFocused = false;
    this.$emit("onBlur", { input: this.input, items: this.filteredItems });
  }

  onArrowDown() {
    if (
      this.isListVisible &&
      this.currentSelectionIndex < this.filteredItems.length - 1
    ) {
      this.currentSelectionIndex++;
    }
    this.scrollSelectionIntoView();
  }

  onArrowUp() {
    if (
      this.isListVisible &&
      this.currentSelectionIndex > this.minSelectionIndex
    ) {
      this.currentSelectionIndex--;
    }
    this.scrollSelectionIntoView();
  }

  scrollSelectionIntoView() {
    setTimeout(() => {
      const wrapper = document.getElementById(this.wrapperId);
      if (!wrapper) {
        return;
      }
      const list_node = wrapper.getElementsByClassName(
        `.simple-typeahead-list`
      );
      const active_node = wrapper.querySelector(
        ".simple-typeahead-list-item.simple-typeahead-list-item-active"
      );

      // nothing to do if active_node or list_node are no HTMLElements
      if (
        !(active_node instanceof HTMLElement) ||
        !(list_node instanceof HTMLElement)
      ) {
        return;
      }

      if (
        !(
          active_node.offsetTop >= list_node.scrollTop &&
          active_node.offsetTop + active_node.offsetHeight <
            list_node.scrollTop + list_node.offsetHeight
        )
      ) {
        let scroll_to = 0;
        if (active_node.offsetTop > list_node.scrollTop) {
          scroll_to =
            active_node.offsetTop +
            active_node.offsetHeight -
            list_node.offsetHeight;
        } else if (active_node.offsetTop < list_node.scrollTop) {
          scroll_to = active_node.offsetTop;
        }
        list_node.scrollTo(0, scroll_to);
      }
    });
  }

  selectCurrentSelection() {
    if (
      this.isListVisible &&
      this.currentSelectionIndex < this.filteredItems.length
    ) {
      this.selectItem(this.filteredItems[this.currentSelectionIndex]);
    }
  }

  selectItem(item: unknown) {
    let itemToSelect = item;
    let newItemAdded = false;

    if (this.currentSelectionIndex === -1 && this.addNewHandler !== undefined) {
      // dont add a new item if the current value already exists
      let itemAlreadyExists = false;
      for (const i in this.filteredItems) {
        const suggestion = this.filteredItems[i];
        if (this.itemProjection(suggestion) === this.input) {
          itemToSelect = suggestion;
          itemAlreadyExists = true;
          break;
        }
      }
      if (!itemAlreadyExists) {
        this.addNewHandler(this.input);
        newItemAdded = true;
      }
    }

    if (!newItemAdded) {
      this.input = this.itemProjection(itemToSelect);
      this.$emit("selectItem", itemToSelect);
    }

    this.currentSelectionIndex = this.minSelectionIndex;
    document.getElementById(this.inputId)?.blur();
    if (this.resetOnSelect) {
      this.input = "";
    }
  }

  escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  boldMatchText(text: string) {
    const regexp = new RegExp(`(${this.escapeRegExp(this.input)})`, "ig");
    return text.replace(regexp, "<strong>$1</strong>");
  }
}
</script>

<style scoped>
.simple-typeahead {
  position: relative;
  width: 100%;
}
.simple-typeahead > input {
  margin-bottom: 0;
}
.simple-typeahead .simple-typeahead-list {
  position: absolute;
  width: 100%;
  border: none;
  max-height: 400px;
  overflow-y: auto;
  border-bottom: 0.1rem solid #d1d1d1;
  z-index: 9;
}
.simple-typeahead .simple-typeahead-list .simple-typeahead-list-header {
  background-color: #fafafa;
  padding: 0.6rem 1rem;
  border-bottom: 0.1rem solid #d1d1d1;
  border-left: 0.1rem solid #d1d1d1;
  border-right: 0.1rem solid #d1d1d1;
}
.simple-typeahead .simple-typeahead-list .simple-typeahead-list-footer {
  background-color: #fafafa;
  padding: 0.6rem 1rem;
  border-left: 0.1rem solid #d1d1d1;
  border-right: 0.1rem solid #d1d1d1;
}
.simple-typeahead .simple-typeahead-list .simple-typeahead-list-item {
  cursor: pointer;
  background-color: #fafafa;
  padding: 0.6rem 1rem;
  border-bottom: 0.1rem solid #d1d1d1;
  border-left: 0.1rem solid #d1d1d1;
  border-right: 0.1rem solid #d1d1d1;
}
.simple-typeahead
  .simple-typeahead-list
  .simple-typeahead-list-item:last-child {
  border-bottom: none;
}
.simple-typeahead
  .simple-typeahead-list
  .simple-typeahead-list-item.simple-typeahead-list-item-active {
  background-color: #e1e1e1;
}
</style>
