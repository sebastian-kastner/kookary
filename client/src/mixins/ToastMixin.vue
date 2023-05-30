<script lang="ts">
import { Vue, ComponentBase } from "vue-facing-decorator";
import { useToast } from "vue-toast-notification";

@ComponentBase
export default class ToastMixin extends Vue {
  showToast = useToast();
}
</script>
